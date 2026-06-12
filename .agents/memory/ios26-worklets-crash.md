---
name: iOS 26 crash — worklets native incompatibility
description: Root cause and fix for persistent iOS 26 crash in Expo 54 builds. Worklets 0.5.1 crashes before JS runs.
---

# iOS 26 crash — react-native-worklets incompatibility

## The rule
`react-native-worklets@0.5.1` is incompatible with iOS 26. It uses deep ObjC runtime hooks
that crash before JS loads (SIGABRT at binary offset ~76KB, before any React mounts).
Confirmed by `"is_beta": 1` in crash log (`os_version: iPhone OS 26.5.1`).

**Fix**: Upgrade worklets to `0.8.3` (supports `react-native: 0.81 - 0.85`).
Pair with `react-native-reanimated@~4.3.1` (requires `worklets: 0.8.x`, `react-native: 0.81 - 0.85`).

**Why**: worklets 0.5.1 predates iOS 26. The ObjC layer in 0.8.x was rewritten for iOS 26 compat.
Native crash happens in `+load` / pre-JS initialization — NOT catchable by expo-updates or JS error handlers.

## Worklets version matrix (RN 0.81.x compatible)
- worklets 0.5.x — RN 0.81.x — iOS 26 CRASH
- worklets 0.7.x — `react-native: *` — iOS 26 status unknown
- worklets 0.8.x — `react-native: 0.81 - 0.85` — iOS 26 WORKS ← use this with SDK 54
- worklets 0.9.x — `react-native: 0.83 - 0.86` — requires SDK 55+

## Reanimated pairing
- reanimated 4.1.x → worklets 0.5.x
- reanimated 4.2.x → worklets 0.7 - 0.8
- reanimated 4.3.x → worklets 0.8.x (RN 0.81-0.85) ← SDK 54 sweet spot
- reanimated 4.4.x → worklets 0.9.x (RN 0.83-0.86) → requires SDK 55

## Also upgraded for iOS 26 compatibility
- expo-build-properties: added `deploymentTarget: "16.0"` to ios config
- keyboard-controller: 1.18.5 → 1.21.11
- react-native-screens: 4.16.0 → 4.24.0 (4.25.x requires RN 0.82+)
- react-native-safe-area-context: 5.6.0 → 5.8.0
- @react-native-firebase: 24.0.0 → 24.1.1
- react-native-purchases: 10.0.1 → 10.2.3

## react-native-purchases API change (10.x)
In 10.2.x, `CustomerInfo.activeSubscriptions` type changed to `string[]`.
`detectBuilderTier()` in `lib/revenuecat.tsx` now accepts `string[] | Set<string>`
and normalizes internally with `Array.isArray()` check.

## Diagnostics that ruled out other causes
- expo-updates disabled in build 11 → STILL crashed → expo-updates NOT the cause
- NativeTabs removed in build 8 → STILL crashed → NativeTabs NOT the cause
- Crash is always SIGABRT at binary offset ~76632 across all builds 8-11
- `"is_beta": 1` + `os_version: 26.5.1` = device is on iOS 26 beta
