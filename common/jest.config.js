'use-strict';

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testPathIgnorePatterns: ['lib'],
  testEnvironment: 'jest-environment-jsdom',
};
