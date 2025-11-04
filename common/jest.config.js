'use-strict';

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testPathIgnorePatterns: ['lib'],
  testEnvironment: 'jest-environment-jsdom',
  // Transform `@wellcometrust/wellcome-design-system` because it ships ESM syntax
  // which Jest can't parse unless it's transformed
  transformIgnorePatterns: [
    '/node_modules/(?!@wellcometrust/wellcome-design-system)',
  ],
};
