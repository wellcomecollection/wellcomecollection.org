import supertest from 'supertest';
import {app} from '../setup-app';

const server = app.listen();
const request = supertest.agent(server);
afterAll(() => {
  server.close();
});

it('Renders an event', async () => {
  const res = await request.get('/events/WiliFikAAFgPFY5o');
  expect(res.status).toBe(200);
});
