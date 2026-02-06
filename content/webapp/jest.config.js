'use-strict';

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Transform `uuid`, `@wellcometrust/wellcome-design-system`, `@prismicio`, `esm-env` (and scoped @weco packages)
  // because they ship ESM syntax which Jest can't parse unless it's transformed.
  // This pattern tells Jest to transform files in `node_modules` for
  // `@weco` packages, `uuid`, `@wellcometrust/wellcome-design-system`, `@prismicio`, and `esm-env`.
  transformIgnorePatterns: [
    '/node_modules/(?!(?:@weco|uuid|@wellcometrust/wellcome-design-system|@prismicio|esm-env)/)',
  ],
};
