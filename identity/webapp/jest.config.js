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
        '<rootDir>/test/*.test.ts',
      ],
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/**/*.test.ts*'],
      testEnvironment: 'jest-environment-jsdom',
      transformIgnorePatterns: [
        '<rootDir>//node_modules/(?!(jose)/).*/',
        '<rootDir>//node_modules/(?!(@panva/hkdf)/).*/',
      ],
      setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    },
  ],
};

module.exports = config;
