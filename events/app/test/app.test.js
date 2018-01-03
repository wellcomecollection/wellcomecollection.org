import supertest from 'supertest';
import {app} from '../setup-app';
import {isValidStructuredData} from 'common/test/structured-data-testing-tool';

const server = app.listen();
const request = supertest.agent(server);
var eventsReponse;
var eventReponse;
beforeAll(async () => {
  eventsReponse = await request.get('/events');
  eventReponse = await request.get('/events/WiliFikAAFgPFY5o');
  return Promise.all([eventsReponse, eventReponse])
});

afterAll(() => {
  server.close();
});

it('Renders events', async () => {
  expect(eventsReponse.status).toBe(200);
});

it('Renders an event', async () => {
  expect(eventReponse.status).toBe(200);
});

it('Renders valid events JSON+LD', async () => {
  const valid = await isValidStructuredData(eventsReponse.text);
  expect(valid).toBe(true);
});

it('Renders valid event JSON+LD', async () => {
  const valid = await isValidStructuredData(eventReponse.text);
  expect(valid).toBe(true);
});
