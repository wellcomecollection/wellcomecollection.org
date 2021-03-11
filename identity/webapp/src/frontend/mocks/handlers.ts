import { rest } from 'msw';

export const handlers = [
  rest.post('/api/user/create', (req, res, ctx) => {
    return res(ctx.status(201));
  }),
];
