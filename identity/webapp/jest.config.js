const path = require('path');

/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/pages/**/*.test.ts',
        '<rootDir>/components/**/*.test.ts',
        '<rootDir>/views/**/*.test.ts',
        '<rootDir>/test/*.test.ts',
      ],
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/**/*.test.ts*'],
      testEnvironment: 'jest-environment-jsdom',
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
        '<rootDir>//node_modules/(?!(jose)/).*/',
        '<rootDir>//node_modules/(?!(@panva/hkdf)/).*/',
        '<rootDir>//node_modules/(?!(@wellcometrust/wellcome-design-system)/).*/',
      ],
      setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    },
  ],
};

module.exports = config;
