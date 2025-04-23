/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/pages/**/*.test.ts',
        '<rootDir>/src/middleware/**/*.test.ts',
        '<rootDir>/src/routes/**/*.test.ts',
        '<rootDir>/src/utils/**/*.test.ts',
        '<rootDir>/src/*.test.ts',
      ],
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/src/frontend/**/*.test.ts*'],
      testEnvironment: 'jest-environment-jsdom',
      transformIgnorePatterns: [
        '<rootDir>//node_modules/(?!(jose)/).*/',
        '<rootDir>//node_modules/(?!(@panva/hkdf)/).*/',
      ],
      setupFilesAfterEnv: ['<rootDir>/src/frontend/jest-setup.ts'],
    },
  ],
};

module.exports = config;
