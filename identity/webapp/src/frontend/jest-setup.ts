import '@testing-library/jest-dom';
import 'whatwg-fetch'; // This is polyfilled by Next.js in the actual application
import { configure } from '@testing-library/react';
import { server } from './mocks/server';

configure({ testIdAttribute: 'data-test-id' });

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
