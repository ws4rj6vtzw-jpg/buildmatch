import { Router } from "express";
import twilio from "twilio";

const router = Router();

// In-memory store — fine for MVP (resets on server restart)
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

// POST /api/auth/send-otp
router.post("/auth/send-otp", async (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    res.status(400).json({ message: "Phone number required" });
    return;
  }

  const normalized = normalizePhone(phone);
  const code = generateCode();
  otpStore.set(normalized, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  const sid = process.env["TWILIO_ACCOUNT_SID"];
  const token = process.env["TWILIO_AUTH_TOKEN"];
  const from = process.env["TWILIO_PHONE_NUMBER"];

  if (!sid || !token || !from) {
    // Dev fallback: log the code instead of sending SMS
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

// POST /api/auth/verify-otp
router.post("/auth/verify-otp", async (req, res) => {
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
  req.log.info({ normalized }, "OTP verified successfully");
  res.json({ ok: true });
});

export default router;
