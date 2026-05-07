import { Router } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, swipesTable, matchesTable, messagesTable, jobsTable, pushTokensTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { sendPushNotification } from "../lib/push";

const router = Router();

function newId(prefix = "m") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

// GET /api/swipes — all swipes by the current user
router.get("/swipes", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(swipesTable)
    .where(eq(swipesTable.fromId, req.auth!.userId))
    .orderBy(swipesTable.ts);

  res.json(
    rows.map((s) => ({
      fromId: s.fromId,
      toId: s.toId,
      direction: s.direction,
      ts: new Date(s.ts).getTime(),
    })),
  );
});

async function getPushToken(userId: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(pushTokensTable)
    .where(eq(pushTokensTable.userId, userId));
  return row?.token ?? null;
}

// POST /api/swipes → { matched, matchId? }
router.post("/swipes", requireAuth, async (req, res): Promise<void> => {
  const { toId, direction, swipeType } = req.body as {
    toId?: string;
    direction?: string;
    swipeType?: string;
  };

  if (!toId || !direction || !swipeType) {
    res.status(400).json({ message: "toId, direction and swipeType are required" });
    return;
  }

  const meId = req.auth!.userId;

  // Record swipe
  await db.insert(swipesTable).values({
    fromId: meId,
    toId,
    direction,
    swipeType,
  });

  if (direction !== "right") {
    res.json({ matched: false });
    return;
  }

  // Auto-match on right swipe (MVP)
  let matchId: string | undefined;
  let builderId = meId;
  let workerId = toId;
  let jobId: string | undefined;
  let notifyUserId: string | undefined;

  if (swipeType === "worker") {
    // Builder swiped right on worker
    builderId = meId;
    workerId = toId;
    notifyUserId = toId;
  } else if (swipeType === "builder") {
    // Worker swiped right on builder
    builderId = toId;
    workerId = meId;
    notifyUserId = toId;
  } else if (swipeType === "job") {
    // Worker swiped right on a job
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, toId));
    if (job) {
      builderId = job.builderId;
      workerId = meId;
      jobId = toId;
      notifyUserId = job.builderId;
      // Add worker to job applicants
      const current = (job.applicants as string[]) ?? [];
      if (!current.includes(meId)) {
        await db
          .update(jobsTable)
          .set({ applicants: [...current, meId] })
          .where(eq(jobsTable.id, toId));
      }
    }
  }

  matchId = newId("m");
  await db.insert(matchesTable).values({
    id: matchId,
    builderId,
    workerId,
    jobId: jobId ?? null,
  });

  // Send push notification to the other party
  if (notifyUserId) {
    const pushToken = await getPushToken(notifyUserId);
    if (pushToken) {
      if (swipeType === "worker") {
        await sendPushNotification(
          pushToken,
          "You've been matched! 🎉",
          "A builder is interested in working with you. Open BuildMatch to chat.",
          { matchId },
        );
      } else if (swipeType === "builder" || swipeType === "job") {
        await sendPushNotification(
          pushToken,
          "New match on BuildMatch! 🔨",
          "A skilled worker wants to connect. Open BuildMatch to chat.",
          { matchId },
        );
      }
    }
  }

  req.log.info({ meId, toId, swipeType, matchId }, "Right swipe — match created");
  res.json({ matched: true, matchId });
});

// DELETE /api/swipes/last — undo last swipe
router.delete("/swipes/last", requireAuth, async (req, res): Promise<void> => {
  const meId = req.auth!.userId;

  const [last] = await db
    .select()
    .from(swipesTable)
    .where(eq(swipesTable.fromId, meId))
    .orderBy(desc(swipesTable.ts))
    .limit(1);

  if (!last) {
    res.json({ undoneId: null });
    return;
  }

  await db
    .delete(swipesTable)
    .where(and(eq(swipesTable.id, last.id)));

  // If it was a right swipe, remove match and messages
  if (last.direction === "right") {
    let matchQuery;
    if (last.swipeType === "worker") {
      matchQuery = and(
        eq(matchesTable.builderId, meId),
        eq(matchesTable.workerId, last.toId),
      );
    } else if (last.swipeType === "builder") {
      matchQuery = and(
        eq(matchesTable.workerId, meId),
        eq(matchesTable.builderId, last.toId),
      );
    } else {
      matchQuery = and(
        eq(matchesTable.workerId, meId),
        eq(matchesTable.jobId, last.toId),
      );
    }

    const [match] = await db.select().from(matchesTable).where(matchQuery);
    if (match) {
      await db.delete(messagesTable).where(eq(messagesTable.matchId, match.id));
      await db.delete(matchesTable).where(eq(matchesTable.id, match.id));
    }
  }

  res.json({ undoneId: last.toId });
});

export default router;
