import apm from 'elastic-apm-node';
import Koa from 'koa';
import { Middleware } from 'koa-compose';

/**
 * Converts anything that can be thrown into something `captureError` accepts.
 * Stringifying can itself throw (e.g. `Object.create(null)`), which would mask
 * the original error, so fall back to a fixed message.
 */
function toCapturableError(error: unknown): Error | string {
  if (error instanceof Error) return error;

  try {
    return String(error);
  } catch {
    return 'Non-Error value thrown';
  }
}

/**
 * Reporting must never throw: this runs inside the catch block, so a failure
 * here would replace the request's original error.
 */
function captureErrorSafely(error: unknown): void {
  try {
    apm.captureError(toCapturableError(error));
  } catch (captureFailure) {
    // Log it so a broken APM agent is visible, the caller rethrows the original
    console.error('Failed to report error to APM', captureFailure);
  }
}

async function errorMiddleware(
  ctx: Koa.DefaultContext,
  next: Koa.Next
): ReturnType<Koa.Next> {
  try {
    await next();
  } catch (error) {
    // https://www.elastic.co/docs/reference/apm/agents/nodejs/koa#koa-error-logging
    captureErrorSafely(error);
    throw error;
  }
}

export const apmErrorMiddleware: Middleware<Koa.DefaultContext> =
  errorMiddleware;
