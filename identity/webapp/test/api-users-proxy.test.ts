import { NextApiRequest, NextApiResponse } from 'next';

import handler from '@weco/identity/pages/api/users/[[...users]]';
import auth0 from '@weco/identity/utils/auth0';

// The real modules pull in the auth0 SDK, which is ESM-only and can't be
// loaded by jest's CommonJS transform
jest.mock('@weco/identity/utils/auth0', () => ({
  __esModule: true,
  default: {
    withApiAuthRequired: (h: unknown) => h,
    getAccessToken: jest.fn(),
  },
}));

jest.mock('@auth0/nextjs-auth0/errors', () => ({
  __esModule: true,
  AccessTokenError: class AccessTokenError extends Error {},
}));

const mockRequest = jest.fn();
jest.mock('@weco/identity/utils/fetch-helpers', () => ({
  FetchClient: jest.fn().mockImplementation(() => ({
    request: (...args: unknown[]) => mockRequest(...args),
    defaults: { headers: { common: {} } },
  })),
}));

const mockedAuth0 = jest.mocked(auth0);

const makeRequest = (method: string, users?: string[]) =>
  ({
    method,
    query: users ? { users } : {},
    body: '',
  }) as unknown as NextApiRequest;

type RecordedResponse = NextApiResponse & {
  statusCode: number;
  body?: unknown;
};

const makeResponse = (): RecordedResponse => {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    send(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res as unknown as RecordedResponse;
};

describe('/api/users/[[...users]]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth0.getAccessToken.mockResolvedValue({ token: 'token' } as never);
    mockRequest.mockResolvedValue({ status: 200, data: { ok: true } });
  });

  // Every call the identity and content apps make through this proxy
  it.each([
    ['PUT', ['me']],
    ['PUT', ['me', 'password']],
    ['PUT', ['me', 'deletion-request']],
    ['POST', ['me', 'send-verification-email']],
    ['GET', ['me', 'item-requests']],
    ['POST', ['me', 'item-requests']],
  ])('forwards %s /users/%s', async (method, users) => {
    const res = makeResponse();
    await handler(makeRequest(method, users), res);

    expect(res.statusCode).toBe(200);
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: `/users/${users.join('/')}`, method })
    );
  });

  it.each([
    ['another user', ['p1234567']],
    ['another user’s sub-path', ['p1234567', 'item-requests']],
    ['a traversal', ['me', '..', '..', 'admin']],
    ['an unknown sub-path', ['me', 'registration']],
    ['an inherited object key', ['constructor']],
    ['no path', undefined],
  ])('rejects %s without calling the API', async (_, users) => {
    const res = makeResponse();
    await handler(makeRequest('GET', users), res);

    expect(res.statusCode).toBe(404);
    expect(mockRequest).not.toHaveBeenCalled();
    expect(mockedAuth0.getAccessToken).not.toHaveBeenCalled();
  });

  it('rejects a method the route does not support', async () => {
    const res = makeResponse();
    await handler(makeRequest('DELETE', ['me']), res);

    expect(res.statusCode).toBe(405);
    expect(mockRequest).not.toHaveBeenCalled();
  });
});
