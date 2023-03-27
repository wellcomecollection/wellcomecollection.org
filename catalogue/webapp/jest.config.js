'use-strict';

module.exports = {
  modulePathIgnorePatterns: ['/e2e/'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
