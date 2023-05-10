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
  server.close();
});

test('healthcheck', async () => {
  await request
    .get('/api/content/management/healthcheck')
    .expect(200)
    .then(response => {
      expect(response.text).toEqual('ok');
    });
});
