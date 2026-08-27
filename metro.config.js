const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable Drizzle ORM inline .sql imports
config.resolver.sourceExts.push("sql");

// better-sqlite3 is a Node.js C++ module used only in Jest tests.
// Intercept it in Metro's resolver so Metro uses a stub and never attempts to bundle Node's 'fs' module.
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "better-sqlite3") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "db/better-sqlite3-stub.js"),
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;


