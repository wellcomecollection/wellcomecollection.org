'use-strict';

module.exports = {
  setupFilesAfterEnv: ['<rootDir>test/setupTests.ts'],
  testPathIgnorePatterns: ['lib'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2021',
          parser: {
            syntax: 'typescript',
            tsx: true,
            dynamicImport: true,
          },
        },
      },
    ],
  },
  // moduleNameMapper: {
  //   // <--- this one
  //   '^(\\.{1,2}/.*)\\.js$': '$1',
  // },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // <--- this one
};
