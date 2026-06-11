import { NextApiRequest, NextApiResponse } from 'next';

import handler from '@weco/identity/pages/api/auth/me';
import auth0 from '@weco/identity/utils/auth0';

// The real modules pull in the auth0 SDK, which is ESM-only and can't be
// loaded by jest's CommonJS transform
jest.mock('@weco/identity/utils/auth0', () => ({
  __esModule: true,
  auth0Domain: 'auth0.test',
  default: {
    getSession: jest.fn(),
    getAccessToken: jest.fn(),
    updateSession: jest.fn(),
  },
}));

jest.mock('@auth0/nextjs-auth0/errors', () => ({
  __esModule: true,
  AccessTokenError: class AccessTokenError extends Error {},
}));

const { AccessTokenError } = jest.requireMock('@auth0/nextjs-auth0/errors');

const mockedAuth0 = jest.mocked(auth0);

const makeRequest = (query: Record<string, string> = {}) =>
  ({ query }) as unknown as NextApiRequest;

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
    end() {
      return res;
    },
  };
  return res as unknown as RecordedResponse;
};

const user = {
  sub: 'auth0|p1234567',
  email: 'stacks@wellcomecollection.org',
  'https://wellcomecollection.org/patron_barcode': '1234567',
  'https://wellcomecollection.org/patron_role': 'Reader',
};

describe('/api/auth/me', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('responds 204 when there is no session', async () => {
    mockedAuth0.getSession.mockResolvedValue(null);
    const res = makeResponse();

    await handler(makeRequest(), res);

    expect(res.statusCode).toBe(204);
  });

  it('responds with the user from the session', async () => {
    mockedAuth0.getSession.mockResolvedValue({ user } as never);
    const res = makeResponse();

    await handler(makeRequest(), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(user);
  });

  it('refreshes the profile from Auth0 when asked to refetch', async () => {
    mockedAuth0.getSession.mockResolvedValue({ user } as never);
    mockedAuth0.getAccessToken.mockResolvedValue({ token: 'token' } as never);
    const updatedProfile = { ...user, email: 'reading-room@example.org' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => updatedProfile,
    });
    const res = makeResponse();

    await handler(makeRequest({ refetch: '' }), res);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://auth0.test/userinfo',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
      })
    );
    expect(mockedAuth0.updateSession).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ user: updatedProfile })
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedProfile);
  });

  it('responds 401 when the access token cannot be refreshed', async () => {
    mockedAuth0.getSession.mockResolvedValue({ user } as never);
    mockedAuth0.getAccessToken.mockRejectedValue(
      new AccessTokenError('failed_to_refresh_token')
    );
    const res = makeResponse();

    await handler(makeRequest({ refetch: '' }), res);

    expect(res.statusCode).toBe(401);
  });

  it('responds 500 when the profile cannot be fetched from Auth0', async () => {
    mockedAuth0.getSession.mockResolvedValue({ user } as never);
    mockedAuth0.getAccessToken.mockResolvedValue({ token: 'token' } as never);
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429 });
    const res = makeResponse();

    await handler(makeRequest({ refetch: '' }), res);

    expect(res.statusCode).toBe(500);
    expect(mockedAuth0.updateSession).not.toHaveBeenCalled();
  });
});
