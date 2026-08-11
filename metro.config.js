const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Drizzle ORM inline .sql imports
config.resolver.sourceExts.push("sql");

module.exports = config;
