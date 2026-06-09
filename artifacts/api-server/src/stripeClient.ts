import Stripe from 'stripe';
import { StripeSync } from 'stripe-replit-sync';

type ConnSettings = {
  secret?: string;
  webhook_secret?: string;
  publishable?: string;
};
type ConnResp = { items?: Array<{ settings?: ConnSettings }> };

async function fetchConnSettings(): Promise<ConnSettings> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      'Missing Replit environment variables. ' +
      'Ensure the Stripe integration is connected via the Integrations tab.'
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = (await resp.json()) as ConnResp;
  const items = data.items ?? [];
  // Prefer live connection (sk_live_) over test; fall back to first available
  const live = items.find((i) => i.settings?.secret?.startsWith('sk_live_'));
  const chosen = live ?? items[0];
  return chosen?.settings ?? {};
}

async function getStripeCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  const settings = await fetchConnSettings();

  if (!settings.secret) {
    throw new Error(
      'Stripe integration not connected or missing secret key. ' +
      'Connect Stripe via the Integrations tab first.'
    );
  }

  return {
    secretKey: settings.secret,
    webhookSecret: settings.webhook_secret,
  };
}

export async function getPublishableKey(): Promise<string> {
  const settings = await fetchConnSettings();
  return settings.publishable ?? '';
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? '',
  });
}
