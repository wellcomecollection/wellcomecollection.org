import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import handler from '@weco/identity/pages/api/registration';
import {
  identityApiV1,
  identityApiV2,
} from '@weco/identity/utils/identity-api';

const secret = 'action-secret';

jest.mock('@weco/identity/config', () => ({
  getConfig: () => ({
    auth0: {
      domain: 'auth0.test',
      clientID: 'client-id',
      clientSecret: 'client-secret',
      actionSecret: 'action-secret',
    },
    remoteApi: {
      host: 'https://v1.test',
      apiKey: 'v1-key',
      audience: 'https://v1.test',
    },
  }),
}));

const mockChooseIdentityApi = jest.fn();
jest.mock('@weco/identity/utils/identity-api', () => {
  const actual = jest.requireActual('@weco/identity/utils/identity-api');
  const identityApiV1 = { version: 1, host: 'https://v1.test', apiKey: 'v1' };
  const identityApiV2 = { version: 2, host: 'https://v2.test', apiKey: 'v2' };
  return {
    identityApiV1,
    identityApiV2,
    chooseIdentityApi: (...args: unknown[]) => mockChooseIdentityApi(...args),
    isAuth0StoredUser: actual.isAuth0StoredUser,
  };
});

// server-data refuses to load outside a server, and jest runs these in jsdom
jest.mock('@weco/common/server-data', () => ({ getCachedToggles: jest.fn() }));
jest.mock('@weco/common/server-data/toggles', () => ({
  getTogglesFromContext: jest.fn(),
}));

// Records which API each client was built for, and the requests sent to it
const mockPut = jest.fn();
jest.mock('@weco/identity/utils/auth', () => ({
  authenticatedInstanceFactory:
    (_getToken: unknown, getInstanceConfig: () => { baseURL: string }) =>
    async () => ({
      put: (url: string, body: unknown) =>
        mockPut(getInstanceConfig().baseURL, url, body),
    }),
}));

const sessionToken = (payload: Record<string, unknown>) =>
  sign({ iss: 'auth0.test', ...payload }, secret);

const makeRequest = (token: string) =>
  ({
    method: 'POST',
    body: {
      state: 'a-state',
      firstName: 'Ada',
      lastName: 'Lovelace',
      termsAndConditions: 'true',
      sessionToken: token,
    },
  }) as unknown as NextApiRequest;

const makeResponse = () => {
  const res = { redirect: jest.fn() };
  return res as unknown as NextApiResponse & { redirect: jest.Mock };
};

describe('/api/registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPut.mockResolvedValue({ status: 204 });
  });

  it('registers a Sierra patron through v1 with their patron number', async () => {
    mockChooseIdentityApi.mockResolvedValue(identityApiV1);
    const res = makeResponse();
    await handler(makeRequest(sessionToken({ sub: 'auth0|p1234567' })), res);

    expect(mockPut).toHaveBeenCalledWith(
      'https://v1.test',
      '/users/1234567/registration',
      { firstName: 'Ada', lastName: 'Lovelace' }
    );
    expect(res.redirect).toHaveBeenCalledWith(
      302,
      'https://auth0.test/continue?state=a-state'
    );
  });

  it('registers a linked patron through v2 with their Auth0 user ID', async () => {
    mockChooseIdentityApi.mockResolvedValue(identityApiV2);
    const res = makeResponse();
    await handler(
      makeRequest(
        sessionToken({ sub: 'auth0|p1234567', folio_user_id: 'a-folio-id' })
      ),
      res
    );

    expect(mockChooseIdentityApi).toHaveBeenCalledWith(
      expect.anything(),
      'a-folio-id'
    );
    expect(mockPut).toHaveBeenCalledWith(
      'https://v2.test',
      '/users/p1234567/registration',
      { firstName: 'Ada', lastName: 'Lovelace' }
    );
  });

  it('refuses a user Auth0 stores itself when the request would go to v1', async () => {
    mockChooseIdentityApi.mockResolvedValue(identityApiV1);
    const res = makeResponse();
    await handler(
      makeRequest(sessionToken({ sub: 'auth0|0123456789abcdef01234567' })),
      res
    );

    expect(mockPut).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(302, '/account/error');
  });
});
