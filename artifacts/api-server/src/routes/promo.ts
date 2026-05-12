import { Router } from "express";
import { eq, count } from "drizzle-orm";
import { db, promoRedemptionsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const PROMO_CODE = "FOUNDER20";
const PROMO_LIMIT = 20;

// GET /api/promo/status — check if the authed user has redeemed a promo
router.get("/promo/status", requireAuth, async (req, res): Promise<void> => {
  const userId = req.auth!.userId;
  const [row] = await db
    .select()
    .from(promoRedemptionsTable)
    .where(eq(promoRedemptionsTable.userId, userId));

  const [{ value: totalRedeemed }] = await db
    .select({ value: count() })
    .from(promoRedemptionsTable);

  res.json({
    hasPromo: !!row,
    spotsLeft: Math.max(0, PROMO_LIMIT - Number(totalRedeemed)),
  });
});

// POST /api/promo/redeem — redeem a promo code
router.post("/promo/redeem", requireAuth, async (req, res): Promise<void> => {
  const userId = req.auth!.userId;
  const { code } = req.body as { code?: string };

  if (!code || code.trim().toUpperCase() !== PROMO_CODE) {
    res.status(400).json({ message: "Invalid promo code." });
    return;
  }

  // Check if user already redeemed
  const [existing] = await db
    .select()
    .from(promoRedemptionsTable)
    .where(eq(promoRedemptionsTable.userId, userId));

  if (existing) {
    res.status(409).json({ message: "You've already redeemed this offer." });
    return;
  }

  // Check total redemptions with a lock-safe count
  const [{ value: totalRedeemed }] = await db
    .select({ value: count() })
    .from(promoRedemptionsTable);

  if (Number(totalRedeemed) >= PROMO_LIMIT) {
    res.status(410).json({
      message: "Sorry, all 20 free Pro spots have been claimed.",
    });
    return;
  }

  // Record redemption
  await db.insert(promoRedemptionsTable).values({
    userId,
    code: PROMO_CODE,
  });

  const spotsLeft = Math.max(0, PROMO_LIMIT - Number(totalRedeemed) - 1);

  res.json({ success: true, spotsLeft });
});

export default router;
