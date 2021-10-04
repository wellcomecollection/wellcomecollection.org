import { rest } from 'msw';
import { mockUser } from '@weco/common/test/fixtures/identity/user';

export const handlers = [
  rest.post('/account/api/user/create', (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.get('/account/api/users/:userId', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put('/account/api/users/:userId', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put('/account/api/users/:userId/password', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put('/account/api/users/:userId/deletion-request', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get('/account/api/users/:userId/item-requests', (req, res, ctx) => {
    return res(
      ctx.json({
        results: [],
        totalResults: 0,
        type: 'ResultsList',
      })
    );
  }),
];
