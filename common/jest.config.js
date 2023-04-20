'use-strict';

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testPathIgnorePatterns: ['lib'],
  testEnvironment: 'jest-environment-jsdom',
};
