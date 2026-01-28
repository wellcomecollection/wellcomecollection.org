import apm from 'elastic-apm-node';

type Next = () => Promise<unknown>;
type Middleware<Context = unknown> = (
  ctx: Context,
  next: Next
) => Promise<unknown>;

async function errorMiddleware(_ctx: unknown, next: Next): Promise<unknown> {
  try {
    return await next();
  } catch (error) {
    // https://www.elastic.co/guide/en/apm/agent/nodejs/master/koa.html#koa-error-logging
    apm.captureError(error);
    throw error;
  }
}

export const apmErrorMiddleware: Middleware = errorMiddleware;
