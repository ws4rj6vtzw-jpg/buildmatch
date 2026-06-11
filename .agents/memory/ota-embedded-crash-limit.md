---
name: OTA can't fix embedded-bundle startup crashes
description: When fallbackToCacheTimeout=0, OTA updates cannot fix a crash in the embedded bundle — the bundle crashes before the OTA can download and cache.
---

## Rule
If the embedded JS bundle crashes on startup, an OTA update with `fallbackToCacheTimeout: 0` **cannot** fix it. The only solution is a new native build with the fix baked into the embedded bundle.

**Why:** `fallbackToCacheTimeout: 0` means expo-updates loads the embedded bundle immediately without waiting for any OTA download. The crash happens in < 1 second — before the OTA has time to download, unpack, and be stored as the "pending" update. On every subsequent launch, the embedded bundle loads and crashes again. The OTA never gets a chance to be cached.

**How to apply:**
- When a startup crash is reported on a TestFlight/production build, never rely solely on an OTA push to fix it.
- Push an OTA anyway (it'll apply to users who are NOT crashing — e.g., on a different iOS version), but simultaneously submit a new native build.
- To bump the fallback window, `fallbackToCacheTimeout` must be changed in app.json, which also requires a new native build.

## Related pattern — incomplete import guard
A previous fix (0306c75) moved the `isLiquidGlassAvailable()` *call* inside a try-catch but kept the `import ... from "expo-glass-effect"` at module level. That import still executed `requireNativeViewManager` synchronously in `GlassView.ios.tsx`, causing the crash. The complete fix is to **remove the import entirely** and use a platform/version check as a substitute.
