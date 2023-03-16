'use-strict';

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
