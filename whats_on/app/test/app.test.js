/* eslint-disable */

import supertest from 'supertest';
import {app} from '../setup-app';

const server = app.listen();
const request = supertest.agent(server);
let whatsOnResponse;
let exhibitionsReponse;
let exhibitionReponse;
let installationReponse;

beforeAll(async () => {
  whatsOnResponse = await request.get('/whats-on');
  exhibitionsReponse = await request.get('/exhibitions');
  exhibitionReponse = await request.get('/exhibitions/Weoe4SQAAKJwjcDC');
  installationReponse = await request.get('/installations/WqwC1iAAAB8AJgFB');

  return Promise.all([
    whatsOnResponse,
    exhibitionsReponse,
    exhibitionReponse,
    whatsOnResponse
  ]);
});

afterAll(() => {
  server.close();
});

it('Renders whats on', async () => {
  expect(whatsOnResponse.status).toBe(204);
});

it('Renders exhibitions', async () => {
  expect(exhibitionsReponse.status).toBe(200);
});

it('Renders an exhibition', async () => {
  expect(exhibitionReponse.status).toBe(200);
});

it('Renders an installation', async () => {
  expect(installationReponse.status).toBe(200);
});
