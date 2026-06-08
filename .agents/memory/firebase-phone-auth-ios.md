---
name: Firebase Phone Auth iOS crash fix
description: Why Firebase Phone Auth hard-crashes on iOS and how to fix it permanently
---

## The problem
`auth().signInWithPhoneNumber()` causes a hard native crash (app closes) on iOS when no `REVERSED_CLIENT_ID` URL scheme is registered in the binary.

Firebase Phone Auth on iOS uses either:
1. APNs silent push to verify the device (preferred), or
2. reCAPTCHA in a web view as fallback

When reCAPTCHA completes, Google redirects to `com.googleusercontent.apps.{CLIENT_ID}://...`. If that URL scheme isn't registered, iOS has nowhere to redirect and the native layer crashes fatally — not a JS error, an app termination.

## Root cause in this project
The original `GoogleService-Info.plist` had no `CLIENT_ID` or `REVERSED_CLIENT_ID` because Google Sign-In was never enabled in Firebase. Firebase only creates an iOS OAuth 2.0 client when Google Sign-In is enabled as an auth provider.

## Fix
1. Firebase Console → Authentication → Sign-in method → Enable **Google** (creates the OAuth client)
2. Project Settings → General → iOS app → Download new `GoogleService-Info.plist` (now has `CLIENT_ID` + `REVERSED_CLIENT_ID`)
3. Add URL scheme explicitly to `app.json`:
```json
"ios": {
  "infoPlist": {
    "CFBundleURLTypes": [
      { "CFBundleURLSchemes": ["com.googleusercontent.apps.512051311397-djuhcjpnui7img3cbflctefarlrq1ot4"] }
    ]
  }
}
```
4. Bump `buildNumber` and `version` (version change separates OTA channels between old and new binary)
5. New native build required — cannot be fixed via OTA

## Auth flow (build 4+)
- Client: `auth().signInWithPhoneNumber(phone)` → Firebase sends real SMS
- Client: `confirmation.confirm(code)` → Firebase credential
- Client: `credential.user.getIdToken()` → Firebase ID token
- Client→Server: `POST /api/auth/firebase-verify` with `{ idToken }`
- Server: `admin.auth().verifyIdToken(idToken)` → extracts phone number → find/create user → issue JWT

## Fallback (OTA-only, build 3 compatible)
API-based OTP via `POST /api/auth/send-otp` + `POST /api/auth/verify-otp`. Server wildcard mode accepts any 6-digit code. Used while waiting for native build.

**Why:** The `@react-native-firebase/app` Expo plugin does NOT automatically add the REVERSED_CLIENT_ID URL scheme unless it's present in the plist. Without it, the reCAPTCHA redirect crashes the app at the native layer.

## reCAPTCHA showing on TestFlight (no crash, but clunky UX)
If the app works but shows a Google reCAPTCHA web view on every auth attempt, the APNs key is only uploaded to the **Development** slot in Firebase Console. TestFlight and App Store builds use the **Production** APNs environment — Firebase can't send the silent push verification and falls back to reCAPTCHA.

**Fix:** Firebase Console → Project Settings → Cloud Messaging → your iOS app → upload the same `.p8` key to the **Production APNs auth key** slot (Key ID: 8U4W5GPDAN, Team ID: 2C625WHCQT). Takes effect immediately, no rebuild or OTA needed.
