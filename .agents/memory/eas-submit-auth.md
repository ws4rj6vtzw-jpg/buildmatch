---
name: EAS iOS submit authentication
description: How to authenticate eas submit for iOS non-interactively; ASC API key route failed, app-specific password works.
---

# EAS iOS submit authentication

## The rule
Use `EXPO_APPLE_APP_SPECIFIC_PASSWORD` env var for non-interactive iOS submission. The eas.json already has `appleId`, `ascAppId`, `appleTeamId` configured.

**Why:** ASC API key downloads from the Apple Developer portal kept failing in previous sessions. App-specific passwords from appleid.apple.com work reliably and don't require downloading a `.p8` file.

**How to apply:**
```bash
EXPO_APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx eas submit --platform ios --id <build-id> --non-interactive
```
The app-specific password should be stored as a Replit secret (`EXPO_APPLE_APP_SPECIFIC_PASSWORD`) for future submissions. Apple ID: gordonwilson@live.com.au, Team: 2C625WHCQT, ASC App ID: 6769304580.
