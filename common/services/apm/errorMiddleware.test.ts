import apm from 'elastic-apm-node';
import Koa from 'koa';

import { apmErrorMiddleware } from './errorMiddleware';

jest.mock('elastic-apm-node', () => ({
  __esModule: true,
  default: { captureError: jest.fn() },
}));

const captureError = apm.captureError as jest.Mock;
const ctx = {} as Koa.DefaultContext;

const run = (thrown: unknown) =>
  apmErrorMiddleware(ctx, () => Promise.reject(thrown));

describe('apmErrorMiddleware', () => {
  beforeEach(() => captureError.mockReset());

  it('passes the request through when nothing is thrown', async () => {
    await expect(
      apmErrorMiddleware(ctx, () => Promise.resolve())
    ).resolves.toBeUndefined();
    expect(captureError).not.toHaveBeenCalled();
  });

  it('reports an Error as is and rethrows it', async () => {
    const error = new Error('boom');

    await expect(run(error)).rejects.toBe(error);
    expect(captureError).toHaveBeenCalledWith(error);
  });

  it('reports other thrown values as strings and rethrows the original', async () => {
    await expect(run('oops')).rejects.toBe('oops');
    expect(captureError).toHaveBeenCalledWith('oops');
  });

  it('rethrows the original value when it cannot be stringified', async () => {
    const unstringifiable = Object.create(null);

    await expect(run(unstringifiable)).rejects.toBe(unstringifiable);
    expect(captureError).toHaveBeenCalledWith(expect.any(String));
  });

  it('logs and rethrows the original error when reporting itself fails', async () => {
    const error = new Error('boom');
    const apmFailure = new Error('apm is broken');
    captureError.mockImplementation(() => {
      throw apmFailure;
    });
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    await expect(run(error)).rejects.toBe(error);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to report error to APM',
      apmFailure
    );

    consoleError.mockRestore();
  });
});
