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
      // https://github.com/auth0/nextjs-auth0/issues/1947
      moduleNameMapper: {
        '^@auth0/nextjs-auth0$':
          '<rootDir>/../../node_modules/@auth0/nextjs-auth0/dist/client/index.js',
        '^@auth0/nextjs-auth0/server$':
          '<rootDir>/../../node_modules/@auth0/nextjs-auth0/dist/server/index.js',
        '^@auth0/nextjs-auth0/client$':
          '<rootDir>/../../node_modules/@auth0/nextjs-auth0/dist/client/index.js',
      },
    },
  ],
};

module.exports = config;
