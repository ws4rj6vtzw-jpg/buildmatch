import { Router } from "express";
import { or, eq } from "drizzle-orm";
import { db, matchesTable, messagesTable, pushTokensTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { sendPushNotification } from "../lib/push";

const router = Router();

function newId(prefix = "msg") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

// GET /api/matches
router.get("/matches", requireAuth, async (req, res): Promise<void> => {
  const meId = req.auth!.userId;
  const rows = await db
    .select()
    .from(matchesTable)
    .where(or(eq(matchesTable.builderId, meId), eq(matchesTable.workerId, meId)))
    .orderBy(matchesTable.createdAt);

  res.json(
    rows.map((m) => ({
      id: m.id,
      builderId: m.builderId,
      workerId: m.workerId,
      jobId: m.jobId ?? undefined,
      createdAt: new Date(m.createdAt).getTime(),
    })),
  );
});

// GET /api/messages — all messages for all my matches
router.get("/messages", requireAuth, async (req, res): Promise<void> => {
  const meId = req.auth!.userId;

  // Get all match IDs for this user
  const myMatches = await db
    .select({ id: matchesTable.id })
    .from(matchesTable)
    .where(or(eq(matchesTable.builderId, meId), eq(matchesTable.workerId, meId)));

  if (myMatches.length === 0) {
    res.json([]);
    return;
  }

  // Fetch all messages for all matches
  const allMessages: Array<{
    id: string;
    matchId: string;
    fromId: string;
    text: string;
    ts: number;
  }> = [];

  for (const match of myMatches) {
    const msgs = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.matchId, match.id))
      .orderBy(messagesTable.ts);

    for (const m of msgs) {
      allMessages.push({
        id: m.id,
        matchId: m.matchId,
        fromId: m.fromId,
        text: m.text,
        ts: new Date(m.ts).getTime(),
      });
    }
  }

  res.json(allMessages);
});

// GET /api/matches/:id/messages
router.get("/matches/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const matchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const meId = req.auth!.userId;

  const [match] = await db.select().from(matchesTable).where(eq(matchesTable.id, matchId));
  if (!match || (match.builderId !== meId && match.workerId !== meId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.matchId, matchId))
    .orderBy(messagesTable.ts);

  res.json(
    rows.map((m) => ({
      id: m.id,
      matchId: m.matchId,
      fromId: m.fromId,
      text: m.text,
      ts: new Date(m.ts).getTime(),
    })),
  );
});

// POST /api/matches/:id/messages
router.post("/matches/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const matchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const meId = req.auth!.userId;
  const { text } = req.body as { text?: string };

  if (!text) {
    res.status(400).json({ message: "text is required" });
    return;
  }

  const [match] = await db.select().from(matchesTable).where(eq(matchesTable.id, matchId));
  if (!match || (match.builderId !== meId && match.workerId !== meId)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const [created] = await db
    .insert(messagesTable)
    .values({ id: newId("msg"), matchId, fromId: meId, text })
    .returning();

  // Notify the other party
  const otherId = match.builderId === meId ? match.workerId : match.builderId;
  const [tokenRow] = await db
    .select()
    .from(pushTokensTable)
    .where(eq(pushTokensTable.userId, otherId));

  if (tokenRow?.token) {
    await sendPushNotification(tokenRow.token, "New message 💬", text, { matchId });
  }

  res.status(201).json({
    id: created.id,
    matchId: created.matchId,
    fromId: created.fromId,
    text: created.text,
    ts: new Date(created.ts).getTime(),
  });
});

export default router;
