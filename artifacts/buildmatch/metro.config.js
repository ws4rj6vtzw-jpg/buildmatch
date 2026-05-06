const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Block server-only packages (e.g. twilio) from Metro's file watcher
// to prevent ENOENT crashes on large packages not used by the app.
const { blockList } = config.resolver ?? {};
const blockListItems = Array.isArray(blockList) ? blockList : blockList ? [blockList] : [];
config.resolver.blockList = [
  ...blockListItems,
  /node_modules\/.pnpm\/twilio@.*/,
];

module.exports = config;
