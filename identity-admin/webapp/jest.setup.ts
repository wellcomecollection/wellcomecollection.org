import '@testing-library/jest-dom';
import { server } from './__mocks__/server';
// import 'next';

beforeAll(() => {
  server.listen({
    // Throw an exception whenever your test makes an HTTP request
    // that does not have a corresponding request handler (mock).
    onUnhandledRequest: 'error',
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
