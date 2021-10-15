/**
 * @jest-environment node
 */
import supertest, { SuperTest } from 'supertest';
import { Server } from 'http';
import serverPromise from '../start';

let server: Server;
let request: SuperTest<supertest.Test>;

beforeAll(async () => {
  server = await serverPromise;
  request = supertest(server);
});

afterAll(() => {
  server && server.close();
});

test('healthcheck', async () => {
  const resp = request
    ? await request.get('/works/management/healthcheck')
    : { status: 500 };
  expect(resp.status).toEqual(200);
});
