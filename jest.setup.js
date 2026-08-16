// Global setup for Jest tests
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

// Silencing warning logs during test runs if necessary
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
}));
