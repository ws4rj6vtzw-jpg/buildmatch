---
name: RN module-level native calls crash
description: Calling native module functions at JS module level crashes iOS on New Architecture (Fabric)
---

## Rule
Never import or call native modules at module level in React Native, especially in Expo Router apps. Always lazy-require inside components/hooks/effects.

## Extra: Expo Router eagerly requires all route files
Expo Router v3 (SDK 54) uses `require.context` to eagerly load every route file at bundle startup for route registration. A static `import X from 'native-module'` at the top of ANY route file runs immediately — even if that route is never navigated to. If the native module isn't in the binary, `requireNativeModule` throws and the app crashes on every launch. Fix: replace static import with a lazy require() inside a function body with try/catch.

## Example of the crash
```tsx
// CRASHES on iOS New Arch — runs before native bridge is ready
const USE_NATIVE_TABS = isLiquidGlassAvailable();

// SAFE — runs inside React lifecycle, bridge is ready
export default function TabLayout() {
  let useLiquidGlass = false;
  try { useLiquidGlass = isLiquidGlassAvailable(); } catch {}
  ...
}
```

**Why:** With New Architecture (Fabric/JSI), JS bundle evaluation happens before native modules are initialized. Module-level native calls fire during bundle eval → crash.

**How to apply:** Any time you move a native function call to module scope for "caching" or "optimization", stop — keep it inside the component with a try/catch instead.
