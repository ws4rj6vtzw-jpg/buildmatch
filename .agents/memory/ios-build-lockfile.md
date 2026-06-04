---
name: iOS build pnpm lockfile trap
description: Adding @expo/config-plugins as a direct dep to buildmatch/package.json breaks @react-native-firebase/app plugin resolution with the old local EAS CLI (v14.7.1 Nix).
---

# iOS build — pnpm lockfile module resolution trap

## The rule
Never add `@expo/config-plugins` as a direct dependency to `artifacts/buildmatch/package.json`. It must come transitively from `expo`.

**Why:** When pnpm installs it as a direct dep, it installs whatever version satisfies the semver range (e.g. 56.0.8 which now exists). This changes the `.pnpm` virtual store symlink structure, and the old local EAS CLI (v14.7.1, installed via Nix) loses the ability to resolve `@expo/config-plugins` when loading `@react-native-firebase/app`'s own config plugin. The build fails locally before upload.

**How to apply:** If you need `@expo/config-plugins` for a custom plugin, write the plugin without importing it — modify `config.mods` directly (see ios-firebase-plugin.md). If local EAS validation still fails, run `pnpm install` at workspace root to restore consistent symlinks.
