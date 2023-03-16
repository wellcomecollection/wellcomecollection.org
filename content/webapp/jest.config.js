'use-strict';

module.exports = {
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};
