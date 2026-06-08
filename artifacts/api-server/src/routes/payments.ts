import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, usersTable, placementsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { getUncachableStripeClient, getPublishableKey } from "../stripeClient";
import crypto from "crypto";

const router = Router();

const TIER_AMOUNTS: Record<string, number> = {
  free: 2500,
  basic: 800,
  pro: 500,
  elite: 0,
};

// GET /api/payments/payment-method
// Returns whether the authed builder has a saved Stripe payment method
router.get("/payments/payment-method", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.auth!.userId));
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  if (!user.stripeCustomerId) {
    res.json({ hasCard: false });
    return;
  }

  const stripe = await getUncachableStripeClient();
  const methods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: "card",
    limit: 1,
  });

  const pm = methods.data[0];
  res.json({
    hasCard: !!pm,
    card: pm ? {
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
    } : null,
  });
});

// POST /api/payments/setup-intent
// Creates a Stripe customer (if needed) and a SetupIntent for saving a card
router.post("/payments/setup-intent", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.auth!.userId));
  if (!user) { res.status(404).json({ message: "User not found" }); return; }

  const stripe = await getUncachableStripeClient();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      name: user.companyName ?? user.fullName ?? undefined,
      phone: user.phone ?? undefined,
      metadata: { buildMatchUserId: user.id },
    });
    customerId = customer.id;
    await db.update(usersTable)
      .set({ stripeCustomerId: customerId })
      .where(eq(usersTable.id, user.id));
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
  });

  const publishableKey = await getPublishableKey();

  res.json({
    clientSecret: setupIntent.client_secret,
    publishableKey,
    customerId,
  });
});

// POST /api/payments/confirm-hire
// Charges the builder's saved card for a placement fee and records it
router.post("/payments/confirm-hire", requireAuth, async (req, res): Promise<void> => {
  const { matchId, workerId, tier } = req.body as {
    matchId: string;
    workerId: string;
    tier: string;
  };

  if (!workerId || !tier) {
    res.status(400).json({ message: "workerId and tier are required" });
    return;
  }

  const amountPence = TIER_AMOUNTS[tier] ?? TIER_AMOUNTS.free;
  const builderId = req.auth!.userId;
  const placementId = crypto.randomUUID();

  if (amountPence === 0) {
    // Elite tier — no charge needed
    await db.insert(placementsTable).values({
      id: placementId,
      builderId,
      workerId,
      matchId: matchId ?? null,
      amountPence: 0,
      tier,
      status: "waived",
      stripePaymentIntentId: null,
    });
    res.json({ success: true, placementId, charged: false, amountPence: 0 });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, builderId));
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  if (!user.stripeCustomerId) {
    res.status(402).json({ message: "No payment method saved. Please add a card first." });
    return;
  }

  const stripe = await getUncachableStripeClient();

  // Get the customer's default saved card
  const methods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: "card",
    limit: 1,
  });

  if (!methods.data[0]) {
    res.status(402).json({ message: "No payment method saved. Please add a card first." });
    return;
  }

  const paymentMethodId = methods.data[0].id;

  // Create and confirm payment intent in one step
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountPence,
    currency: "gbp",
    customer: user.stripeCustomerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    description: `BuildMatch placement fee — ${tier} tier`,
    metadata: {
      buildMatchPlacementId: placementId,
      builderId,
      workerId,
      tier,
    },
  });

  const status = paymentIntent.status === "succeeded" ? "succeeded" : "pending";

  await db.insert(placementsTable).values({
    id: placementId,
    builderId,
    workerId,
    matchId: matchId ?? null,
    amountPence,
    tier,
    status,
    stripePaymentIntentId: paymentIntent.id,
  });

  res.json({
    success: paymentIntent.status === "succeeded",
    placementId,
    charged: true,
    amountPence,
    status: paymentIntent.status,
  });
});

// GET /api/payments/placements
// Returns the builder's placement history
router.get("/payments/placements", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(placementsTable)
    .where(eq(placementsTable.builderId, req.auth!.userId))
    .orderBy(desc(placementsTable.createdAt))
    .limit(50);

  res.json(rows);
});

export default router;
