import { Middleware } from 'koa';
import { RequestError } from '../utility/errors/request-error';
import { ServerError } from '../utility/errors/server-error';
import { ConflictError } from '../utility/errors/conflict';
import { ApiError } from '../utility/errors/api-error';
import { NotFound } from '../utility/errors/not-found';

export const errorHandler: Middleware = async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof RequestError) {
      context.response.body = { error: err.message };
      context.status = 400;
    } else if (err instanceof ServerError) {
      context.response.status = 500;
    } else if (err instanceof NotFound) {
      if (err.message) {
        context.response.body = { error: err.message };
      }
      context.response.status = 404;
    } else if (err instanceof ConflictError) {
      context.response.status = 409;
      context.response.body = { error: err.message };
    } else if (err instanceof ApiError) {
      context.response.status = 400;
      context.response.body = { error: err.message };
    } else {
      console.log('Unhandled error');
      console.log(err);
      context.response.status = 500;
    }
  }
};
