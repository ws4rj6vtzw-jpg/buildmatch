---
name: Stripe connector field names
description: Replit Stripe connector uses 'secret' and 'publishable' not 'secret_key' / 'publishable_key'. Also stripe-replit-sync must be externalised in esbuild or migrations fail.
---

## Stripe Replit Connector — field names

The Replit Stripe connector exposes these settings fields from the `/api/v2/connection` endpoint:

- `secret` — the Stripe secret key (sk_test_... / sk_live_...)
- `publishable` — the Stripe publishable key (pk_test_... / pk_live_...)
- `webhook_secret` — the webhook signing secret (whsec_...)
- `account_id` — the Stripe account ID

**NOT** `secret_key` or `publishable_key` — those names are wrong and will silently return undefined.

**Why:** Discovered when server logged "missing secret key" despite the connection being healthy. The `listConnections('stripe')` call revealed the actual field names.

**How to apply:** Always use these exact field names in `stripeClient.ts` when reading from the ConnSettings type.

## stripe-replit-sync + esbuild externalisation

`stripe-replit-sync` uses `__dirname` at runtime to locate its `migrations/` folder. When bundled by esbuild, `__dirname` resolves to `dist/` (the bundle output) instead of the package's own directory, causing `runMigrations` to silently skip all SQL migrations (the stripe schema is created but stays empty).

**Fix:** Add `"stripe-replit-sync"` to the `external` array in `build.mjs`. This keeps the package unbundled, so its own `__dirname` points correctly to `node_modules/stripe-replit-sync/dist/`.

**Why:** The banner in `build.mjs` sets `globalThis.__dirname` to the dist bundle path, which overrides the package-internal path resolution.
