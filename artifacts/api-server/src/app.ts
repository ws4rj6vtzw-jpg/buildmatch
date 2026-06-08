import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

// ── Stripe webhook MUST come before express.json() ────────────────────────
// Stripe requires the raw Buffer body to verify the webhook signature.
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Webhook error";
      logger.error({ err }, "Stripe webhook error");
      res.status(400).json({ error: msg });
    }
  },
);

// ── Card-setup page (served before JSON middleware for clarity) ────────────
// Builders open this URL in expo-web-browser to save their card via Stripe.js
app.get("/api/payments/card-setup", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Add Payment Card — BuildMatch</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      padding: 32px 24px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .logo { font-size: 22px; font-weight: 800; color: #f59e0b; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: #94a3b8; margin-bottom: 28px; }
    label { font-size: 13px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
    #card-element {
      background: #0f172a;
      border: 1.5px solid #334155;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 20px;
      transition: border-color 0.2s;
    }
    #card-element.focused { border-color: #f59e0b; }
    #card-errors {
      color: #f87171;
      font-size: 13px;
      margin-bottom: 16px;
      min-height: 20px;
    }
    button {
      width: 100%;
      padding: 15px;
      background: #f59e0b;
      color: #0f172a;
      font-size: 16px;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .success {
      text-align: center;
      padding: 20px 0;
    }
    .success-icon { font-size: 48px; margin-bottom: 12px; }
    .success-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .success-text { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
    .close-btn {
      background: #1e293b;
      color: #f59e0b;
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      width: auto;
    }
    .security { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 12px; margin-top: 16px; justify-content: center; }
  </style>
</head>
<body>
  <div class="card" id="main-card">
    <div class="logo">🔨 BuildMatch</div>
    <div class="subtitle">Securely save your card for placement fees</div>

    <div id="form-view">
      <label>CARD DETAILS</label>
      <div id="card-element"></div>
      <div id="card-errors"></div>
      <button id="submit-btn">Save Card</button>
      <div class="security">🔒 Secured by Stripe — we never store card numbers</div>
    </div>

    <div class="success" id="success-view" style="display:none">
      <div class="success-icon">✅</div>
      <div class="success-title">Card saved!</div>
      <div class="success-text">Your card is ready for BuildMatch placement fees. You can close this window and return to the app.</div>
      <button class="close-btn" onclick="window.close()">Close & Return to App</button>
    </div>
  </div>

  <script>
    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get('secret');
    const publishableKey = params.get('pk');

    if (!clientSecret || !publishableKey) {
      document.getElementById('card-errors').textContent = 'Missing setup parameters. Please return to the app and try again.';
      document.getElementById('submit-btn').disabled = true;
    } else {
      const stripe = Stripe(publishableKey);
      const elements = stripe.elements();
      const cardElement = elements.create('card', {
        style: {
          base: {
            color: '#f1f5f9',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
            '::placeholder': { color: '#475569' },
          },
          invalid: { color: '#f87171' },
        },
      });
      cardElement.mount('#card-element');

      cardElement.on('focus', () => document.getElementById('card-element').classList.add('focused'));
      cardElement.on('blur', () => document.getElementById('card-element').classList.remove('focused'));
      cardElement.on('change', (e) => {
        document.getElementById('card-errors').textContent = e.error ? e.error.message : '';
      });

      document.getElementById('submit-btn').addEventListener('click', async () => {
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        document.getElementById('card-errors').textContent = '';

        const { error } = await stripe.confirmCardSetup(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error) {
          document.getElementById('card-errors').textContent = error.message;
          btn.disabled = false;
          btn.textContent = 'Save Card';
        } else {
          document.getElementById('form-view').style.display = 'none';
          document.getElementById('success-view').style.display = 'block';
        }
      });
    }
  </script>
</body>
</html>`);
});

// ── Standard middleware (after webhook route) ──────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
