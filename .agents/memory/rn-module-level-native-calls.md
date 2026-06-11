---
name: RN module-level native calls crash
description: Calling native module functions at JS module level crashes iOS on New Architecture (Fabric). Includes lesson about unstable-native-tabs.
---

## Rule
Never import or call native modules at module level in React Native, especially in Expo Router apps. Always lazy-require inside components/hooks/effects.

## Extra: Expo Router eagerly requires all route files
Expo Router v3 (SDK 54) uses `require.context` to eagerly load every route file at bundle startup for route registration. A static `import X from 'native-module'` at the top of ANY route file runs immediately — even if that route is never navigated to. If the native module isn't in the binary, `requireNativeModule` throws and the app crashes on every launch.

## expo-router/unstable-native-tabs — avoid entirely
`expo-router/unstable-native-tabs` (used for iOS liquid glass tabs) is experimental and has caused persistent startup crashes across multiple builds even after `expo-glass-effect` was removed. Its import chain pulls in `NativeTabsView.js` → `react-native-screens` BottomTabs native views. The safe approach is to not import it at all and use the standard `expo-router` `<Tabs>` navigator unconditionally.

**Why:** Even with a `Platform.Version >= 26` guard around the component render, the module-level import still evaluates all dependencies synchronously at bundle load time — before any platform check runs.

## expo-glass-effect — never import at module level
`import { isLiquidGlassAvailable } from "expo-glass-effect"` causes `GlassView.ios.tsx` to call `requireNativeViewManager('ExpoGlassEffect', 'GlassView')` at module evaluation time. On devices where the view manager isn't registered (iOS < 26), this throws before any try/catch can protect it. Remove the import entirely; use `Platform.Version >= 26` as the substitute check.

## Example fix
```tsx
// WRONG — module-level import crashes before any try/catch
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { NativeTabs } from "expo-router/unstable-native-tabs";

// RIGHT — use standard Tabs, no NativeTabs, no expo-glass-effect
import { Tabs } from "expo-router";
export default function TabLayout() {
  return <Tabs>...</Tabs>;
}
```

**How to apply:** If asked to re-add liquid glass tabs, ensure expo-glass-effect and unstable-native-tabs are confirmed stable on the target SDK first, and only import them inside a lazy/dynamic require with full try/catch.
