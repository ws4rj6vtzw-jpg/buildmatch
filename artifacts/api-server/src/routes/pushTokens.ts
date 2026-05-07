import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, pushTokensTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// POST /api/push-tokens — register or update device push token
router.post("/push-tokens", requireAuth, async (req, res): Promise<void> => {
  const { token } = req.body as { token?: string };

  if (!token) {
    res.status(400).json({ message: "token is required" });
    return;
  }

  const meId = req.auth!.userId;

  // Upsert: one token per user
  const [existing] = await db
    .select()
    .from(pushTokensTable)
    .where(eq(pushTokensTable.userId, meId));

  if (existing) {
    await db
      .update(pushTokensTable)
      .set({ token })
      .where(eq(pushTokensTable.userId, meId));
  } else {
    await db.insert(pushTokensTable).values({ userId: meId, token });
  }

  req.log.info({ userId: meId }, "Push token registered");
  res.json({ ok: true });
});

export default router;
