import { rest } from 'msw';
import { mockUser } from './user';

export const handlers = [
  rest.post('/api/user/create', (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put('/api/users/me', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put('/api/users/me/password', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put('/api/users/me/deletion-request', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
