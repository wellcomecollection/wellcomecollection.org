'use-strict';

const path = require('path');

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@weco/common/test/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Transform `uuid`, `@wellcometrust/wellcome-design-system`, `@wellcometrust/wellcome-icons`, `@prismicio`, `esm-env` (and scoped @weco packages)
  // because they ship ESM syntax which Jest can't parse unless it's transformed.
  // This pattern tells Jest to transform files in `node_modules` for
  // `@weco` packages, `uuid`, `@wellcometrust/wellcome-design-system`, `@wellcometrust/wellcome-icons`, `@prismicio`, and `esm-env`.
  // `@wellcometrust/wellcome-icons` only exports an `import` condition, which
  // Jest's CommonJS resolver doesn't match, so point it at the ESM entry
  moduleNameMapper: {
    '^@wellcometrust/wellcome-icons$': path.join(
      path.dirname(
        require.resolve('@wellcometrust/wellcome-icons/package.json')
      ),
      'dist/index.js'
    ),
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:@weco|uuid|@wellcometrust/wellcome-(?:design-system|icons)|@prismicio|esm-env)/)',
  ],
};
