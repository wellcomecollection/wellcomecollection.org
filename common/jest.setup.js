process.env.NEXT_PUBLIC_APM_SERVICE_NAME = 'test';
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    // APM config
    environment: 'test',
    serverUrl: 'https://apm',
    centralConfig: true,
  },
}));
