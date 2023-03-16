'use-strict';

module.exports = {
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  modulePathIgnorePatterns: ['/e2e/'],
  testEnvironment: 'jest-environment-jsdom',
};
