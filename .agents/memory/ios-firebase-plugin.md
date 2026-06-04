---
name: iOS Firebase static frameworks plugin
description: Custom config plugin to fix CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES for @react-native-firebase/app with useFrameworks static. Must NOT import @expo/config-plugins.
---

# iOS Firebase static frameworks plugin

## The rule
The plugin at `artifacts/buildmatch/plugins/withFirebaseStaticFrameworks.js` must be self-contained — it modifies `config.mods.ios.dangerous` directly without importing `@expo/config-plugins`.

**Why:** The local EAS CLI (v14.7.1 Nix) runs plugins in its own module resolution context. If the plugin requires `@expo/config-plugins`, it fails locally (see ios-build-lockfile.md). Writing directly to `config.mods` is equivalent to `withDangerousMod` and works in both local validation and on EAS build servers.

**How to apply:** Any new config plugin for this project should follow the same pattern: export a function `(config) => config`, mutate `config.mods` directly using `fs` and `path` from Node stdlib only.
