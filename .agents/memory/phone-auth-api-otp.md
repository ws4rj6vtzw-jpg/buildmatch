---
name: Phone auth — API OTP not Firebase
description: AuthContext must use the API server OTP endpoints, not Firebase phone auth, because Firebase triggers reCAPTCHA on iOS (no APNs configured) which crashes the app via expo-router +not-found screen.
---

## Rule

`AuthContext` `sendOtp`/`verifyOtp` must call `api.sendOtp(phone)` and `api.verifyOtp(phone, code)` — NOT `auth().signInWithPhoneNumber()`.

**Why:** Firebase phone auth on iOS falls back to Google reCAPTCHA when APNs Authentication Key is not uploaded to Firebase Console → Cloud Messaging settings. The reCAPTCHA redirects back to the app via a custom URL scheme (`com.googleusercontent.apps...://firebaseauth/link`). Expo-router intercepts this URL, finds no matching route, and shows the built-in "This screen doesn't exist / Go to home screen" crash screen.

**How to apply:**
- The API server has `/api/auth/send-otp` (wildcard MVP mode — any 6-digit code works) and `/api/auth/verify-otp`.
- `lib/api.ts` already has `api.sendOtp(phone)` and `api.verifyOtp(phone, code)` wired up.
- `AuthContext` should call those directly. No `confirmationRef` needed.
- `verifyOtp` needs `pendingPhone` in its `useCallback` dependency array since it passes it to the API.
- `signOut` no longer needs `auth().signOut()` since the user isn't Firebase-signed-in.

**Future:** When real SMS is needed, wire Twilio into `/api/auth/send-otp` on the server side — no mobile changes required.

**Also fixed alongside this:**
- `+not-found.tsx` now auto-redirects to `/` (previously showed the stock expo-router error screen).
- Stripe client now prefers `sk_live_` connection over `sk_test_` when multiple connections exist.
