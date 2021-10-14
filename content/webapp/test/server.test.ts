/**
 * @jest-environment node
 */
import request from 'supertest';
import serverPromise from '../server';

test('healthcheck', async () => {
  const server = await serverPromise;
  const resp = await request(server.callback()).get(
    '/content/management/healthcheck'
  );

  expect(resp.status).toEqual(200);
});
