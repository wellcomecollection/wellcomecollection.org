import { rest } from 'msw';
import { mockUser } from './UserInfo.mock';

export const handlers = [
  rest.get(new RegExp('/api/user/123'), (_req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put(new RegExp('/api/user/123'), (_req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put(new RegExp('/api/resend-activation-email/123'), (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put(new RegExp('/api/reset-password/123'), (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put(new RegExp('/api/block-account/123'), (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put(new RegExp('/api/unblock-account/123'), (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
