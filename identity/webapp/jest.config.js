module.exports = {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/middleware/**/*.test.ts',
        '<rootDir>/src/routes/**/*.test.ts',
        '<rootDir>/src/utility/**/*.test.ts',
        '<rootDir>/src/*.test.ts',
      ],
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/src/frontend/**/*.test.ts*'],
      setupFilesAfterEnv: ['<rootDir>/src/frontend/jest-setup.ts'],
    },
  ],
};
