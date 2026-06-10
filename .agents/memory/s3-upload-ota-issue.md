---
name: S3 upload — OTA unreliable, use native builds
description: The original production binary had no S3 upload code; multiple OTAs failed to apply; correct upload approach is server-side multipart (FormData)
---

## The rule
For any upload code change: do a **new native EAS build** rather than relying on OTA. Multiple OTAs (same runtime version 1.0.1, production branch) were pushed and none applied to the device.

**Why:** The original binary (v5, version code 5) stored local `file://` URIs directly via `onChange(localUri)` — it had no S3 upload whatsoever. OTA delivery appeared to fail silently (Updates.isEnabled was presumably true, but no presign/upload requests ever appeared in production logs despite many app opens).

**How to apply:** Any client-side upload change must go in a new EAS build. Bump both `versionCode` (Android) and `buildNumber` (iOS) in `app.json`, then run:
```bash
cd artifacts/buildmatch
EAS_SKIP_AUTO_FINGERPRINT=1 eas build --platform android --profile production --non-interactive --no-wait
EAS_SKIP_AUTO_FINGERPRINT=1 eas build --platform ios --profile production --non-interactive --no-wait
```
Use `--no-wait` to avoid timeout (builds take ~20 min on EAS servers).

## Correct upload approach
Server-side multipart via `POST /api/upload/file` using multer:
- React Native FormData with `{ uri, type, name }` object — natively supported on iOS + Android
- Server buffers the file (memoryStorage), PutObjectCommand to S3, returns `publicUrl` (permanent) + `viewUrl` (presigned 7-day fallback)
- Client: `api.uploadFile()` uses native `fetch` (NOT axios) to avoid FormData boundary issues
- `uploadToS3.ts` calls `api.uploadFile()` and returns `publicUrl ?? viewUrl`

## Production server redeploy
New server endpoints (like `/api/upload/file`) require a Replit redeploy — changes to the Replit dev workflow do NOT automatically push to production. User must click Publish in the Replit UI.

## Diagnosis signals
- No `POST /api/upload/presign` or `POST /api/upload/file` in production logs → OTA not applied, original code running
- Frequent `PATCH /api/users/me → 200` with no upload calls → original binary calling `updateProfile({ photo: localUri })` directly
- Photo appears briefly then gone on hard close → localUri stored, OS cleans temp file on restart
