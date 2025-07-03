'use-strict';

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
