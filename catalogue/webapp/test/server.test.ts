/**
 * @jest-environment node
 */

import supertest, { SuperTest } from 'supertest';
import { Server } from 'http';
import serverPromise from '../server';

jest.mock('@weco/common/server-data');

let server: Server;
let request: SuperTest<supertest.Test>;

beforeAll(async () => {
  server = await serverPromise;
  request = supertest(server);
});

afterAll(() => {
  console.log('hello');
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
    // never
  }) as () => never);

  server?.close();
  expect(mockExit).toHaveBeenCalledWith(0);
  mockExit.mockClear();
});

test('healthcheck', async () => {
  const resp = request
    ? await Promise.race([
        new Promise(resolve => setTimeout(resolve({ status: 408 }), 1000)),
        request.get('/works/management/healthcheck'),
      ])
    : { status: 500 };
  expect(resp.status).toEqual(200);
});
