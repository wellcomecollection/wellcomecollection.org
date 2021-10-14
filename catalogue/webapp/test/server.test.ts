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
  server.close();
});

test('healthcheck', async () => {
  const resp = await request.get('/works/management/healthcheck');
  expect(resp.status).toEqual(200);
});
