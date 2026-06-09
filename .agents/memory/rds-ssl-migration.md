---
name: RDS SSL migration
description: How to run drizzle-kit migrations against AWS RDS PostgreSQL (SSL quirks)
---

## The rule
When running `drizzle-kit push` against AWS RDS, use:
```
PGSSLMODE=require NODE_TLS_REJECT_UNAUTHORIZED=0 DATABASE_URL="$RDS_DATABASE_URL" pnpm run push-force
```

**Why:** RDS requires SSL by default (errors: "no pg_hba.conf entry ... no encryption"). drizzle-kit bundles its own copy of `pg` and ignores `dbCredentials.ssl` in `drizzle.config.ts` — the `PGSSLMODE` env var is the only reliable way to force SSL. RDS also uses a self-signed cert chain, so `NODE_TLS_REJECT_UNAUTHORIZED=0` is needed.

**How to apply:** Any time `drizzle-kit push/generate` is run against RDS in CI or shell scripts.

## Runtime pool (lib/db/src/index.ts)
The `pg` Pool reads `ssl: { rejectUnauthorized: false }` from the config object — this works fine at runtime (not the drizzle-kit CLI path). So set `ssl` in Pool constructor when `RDS_DATABASE_URL` is present.
