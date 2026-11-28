'use-strict';

const path = require('path');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testPathIgnorePatterns: ['lib'],
  testEnvironment: 'jest-environment-jsdom',
  // Transform `@wellcometrust/wellcome-design-system`, `@wellcometrust/wellcome-icons`, `@prismicio`, and `esm-env` because they ship ESM syntax
  // which Jest can't parse unless it's transformed
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
    '/node_modules/(?!@wellcometrust/wellcome-(?:design-system|icons)|@prismicio|esm-env)/',
  ],
};
