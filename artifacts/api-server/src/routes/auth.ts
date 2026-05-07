import { Router } from "express";
import twilio from "twilio";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { signToken } from "../lib/jwt";

const router = Router();

const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return `+44${digits}`;
}

function newUserId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function dbUserToAuthUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    phone: user.phone,
    role: user.role as "worker" | "builder",
    fullName: user.fullName ?? undefined,
    primaryTrade: user.primaryTrade ?? undefined,
    skills: (user.skills as string[] | null) ?? undefined,
    yearsExperience: user.yearsExperience ?? undefined,
    availableNow: user.availableNow ?? undefined,
    availableFrom: user.availableFrom ?? undefined,
    bio: user.bio ?? undefined,
    tickets: (user.tickets as string[] | null) ?? undefined,
    hourlyRate: user.hourlyRate ?? undefined,
    publicLiabilityInsured: user.publicLiabilityInsured ?? undefined,
    insurerName: user.insurerName ?? undefined,
    businessType: user.businessType as "sole_trader" | "limited_company" | undefined,
    companyRegNumber: user.companyRegNumber ?? undefined,
    companyName: user.companyName ?? undefined,
    contactName: user.contactName ?? undefined,
    photo: user.photo ?? undefined,
    suburb: user.suburb ?? undefined,
    postcode: user.postcode ?? undefined,
    travelRadiusMiles: user.travelRadiusMiles ?? undefined,
    rating: user.rating ?? 0,
    completedJobs: user.completedJobs ?? 0,
    isPro: user.isPro ?? false,
    profileComplete: user.profileComplete ?? false,
  };
}

// POST /api/auth/send-otp
router.post("/auth/send-otp", async (req, res): Promise<void> => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    res.status(400).json({ message: "Phone number required" });
    return;
  }

  const normalized = normalizePhone(phone);
  const code = generateCode();
  otpStore.set(normalized, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  const isDev = process.env["NODE_ENV"] !== "production";

  // In development always fall back to logging the code — avoids Twilio costs
  if (isDev) {
    req.log.info({ normalized, code }, "Dev mode — OTP logged (skip Twilio)");
    res.json({ ok: true, dev: true });
    return;
  }

  const sid = process.env["TWILIO_ACCOUNT_SID"];
  const token = process.env["TWILIO_AUTH_TOKEN"];
  const from = process.env["TWILIO_PHONE_NUMBER"];

  if (!sid || !token || !from) {
    req.log.info({ normalized, code }, "Twilio not configured — OTP logged");
    res.json({ ok: true, dev: true });
    return;
  }

  try {
    const client = twilio(sid, token);
    await client.messages.create({
      body: `Your BuildMatch verification code is: ${code}. Valid for 10 minutes.`,
      from,
      to: normalized,
    });
    req.log.info({ normalized }, "OTP sent via Twilio");
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Twilio send failed");
    res.status(500).json({ message: "Failed to send SMS. Please try again." });
  }
});

// POST /api/auth/verify-otp → { token, user }
router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  const { phone, code } = req.body as { phone?: string; code?: string };
  if (!phone || !code) {
    res.status(400).json({ message: "Phone and code required" });
    return;
  }

  const normalized = normalizePhone(phone);
  const entry = otpStore.get(normalized);

  if (!entry) {
    res.status(401).json({ message: "No code was sent to this number. Please request a new one." });
    return;
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    res.status(401).json({ message: "Code expired. Please request a new one." });
    return;
  }

  if (entry.code !== code) {
    res.status(401).json({ message: "Incorrect code. Please try again." });
    return;
  }

  otpStore.delete(normalized);

  // Find or create user
  let [existing] = await db.select().from(usersTable).where(eq(usersTable.phone, normalized));
  if (!existing) {
    const [created] = await db
      .insert(usersTable)
      .values({ id: newUserId(), phone: normalized, role: "worker" })
      .returning();
    existing = created;
  }

  const jwtToken = signToken({ userId: existing.id, phone: existing.phone });
  req.log.info({ userId: existing.id }, "OTP verified — JWT issued");
  res.json({ token: jwtToken, user: dbUserToAuthUser(existing) });
});

export default router;
