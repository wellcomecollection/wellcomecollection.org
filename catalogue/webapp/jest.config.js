'use-strict';

module.exports = {
  modulePathIgnorePatterns: ['/e2e/'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
