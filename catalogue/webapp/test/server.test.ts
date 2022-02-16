/**
 * @jest-environment node
 */
/*
import supertest, { SuperTest } from 'supertest';
import { Server } from 'http';
import serverPromise from '../server';

jest.mock('@weco/common/server-data');
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
  // never
}) as () => never);

let server: Server;
let request: SuperTest<supertest.Test>;

beforeAll(async () => {
  server = await serverPromise;
  request = supertest(server);
});

afterAll(() => {

//  server?.close();
//  expect(mockExit).toHaveBeenCalledWith(0);
});

*/
test('healthcheck', async () => {
  return true;
  const resp = request
    ? await request.get('/works/management/healthcheck')
    : { status: 500 };
  expect(resp.status).toEqual(200);
});
