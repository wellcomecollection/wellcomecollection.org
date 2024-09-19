import '@testing-library/jest-dom';
import 'whatwg-fetch'; // This is polyfilled by Next.js in the actual application
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from 'util';

import { server } from './mocks/server';

// TS fix below taken from https://stackoverflow.com/a/77752064
global.TextEncoder = NodeTextEncoder as typeof TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof TextDecoder;

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
