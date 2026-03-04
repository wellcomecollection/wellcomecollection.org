// Mock undici for Jest tests
// The tests don't actually use undici's fetch - they mock the higher-level functions
// So we can provide a simple mock of the Agent class
jest.mock('undici', () => ({
  Agent: class MockAgent {
    constructor() {}
  },
  fetch: jest.fn(),
}));

process.env.NEXT_PUBLIC_APM_SERVICE_NAME = 'test';
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    // APM config
    environment: 'test',
    serverUrl: 'https://apm',
    centralConfig: true,
  },
}));
