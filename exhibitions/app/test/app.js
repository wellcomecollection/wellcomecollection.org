import test from 'ava';
import supertest from 'supertest';
import {app} from '../setup-app';

const request = supertest.agent(app.listen());

test(t => {
  t.deepEqual([1, 2], [1, 2]);
});

test('/exhibitions/:id', async t => {
  const res = await request.get('/exhibitions/WZwh4ioAAJ3usf86');
  t.is(res.status, 200);
});
