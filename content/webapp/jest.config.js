'use-strict';

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Transform `uuid` (and scoped @weco packages) because newer `uuid` releases
  // ship ESM syntax which Jest can't parse unless it's transformed.
  // This pattern tells Jest to transform files in `node_modules` for
  // `@weco` packages and `uuid`.
  transformIgnorePatterns: ['/node_modules/(?!(?:@weco|uuid)/)'],
};
