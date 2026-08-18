module.exports = {
  preset: "jest-expo",
  maxWorkers: 1,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@shopify/flash-list|drizzle-orm)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^test-renderer$": "react-test-renderer",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
