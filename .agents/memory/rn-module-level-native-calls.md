---
name: RN module-level native calls crash
description: Calling native module functions at JS module level crashes iOS on New Architecture (Fabric)
---

## Rule
Never call native module functions at module level in React Native. Always call them inside components, hooks, effects, or event handlers.

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
