'use-strict';

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
