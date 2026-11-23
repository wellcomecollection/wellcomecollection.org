import { sign } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

import {
  chooseIdentityApi,
  folioUserIdClaim,
  folioUserIdFromAccessToken,
  identityApiV1,
  identityApiV2,
  isAuth0StoredUser,
  patronIp,
} from '@weco/identity/utils/identity-api';

jest.mock('@weco/identity/config', () => ({
  getConfig: () => ({
    remoteApi: { host: 'https://v1.test', apiKey: 'v1-key' },
    remoteApiV2: { host: 'https://v2.test', apiKey: 'v2-key' },
  }),
}));

// server-data refuses to load outside a server, and jest runs these in jsdom
jest.mock('@weco/common/server-data', () => ({
  getCachedToggles: jest.fn(),
}));

const mockToggles = jest.fn();
jest.mock('@weco/common/server-data/toggles', () => ({
  getTogglesFromContext: () => mockToggles(),
}));

const request = (headers: Record<string, string> = {}) =>
  ({
    headers,
    socket: { remoteAddress: '127.0.0.1' },
  }) as unknown as NextApiRequest;

describe('chooseIdentityApi', () => {
  it('uses v2 for a patron linked to FOLIO when the toggle is on', async () => {
    mockToggles.mockReturnValue({ featureFlags: { identityApiV2: true } });

    expect(
      await chooseIdentityApi(request(), 'a-folio-user-id', 'auth0|p1234567')
    ).toBe(identityApiV2);
  });

  it('uses v1 for a patron not linked to FOLIO', async () => {
    mockToggles.mockReturnValue({ featureFlags: { identityApiV2: true } });

    expect(
      await chooseIdentityApi(request(), undefined, 'auth0|p1234567')
    ).toBe(identityApiV1);
  });

  it('uses v2 for a user Auth0 stores itself, even with the toggle off', async () => {
    mockToggles.mockReturnValue({ featureFlags: { identityApiV2: false } });

    expect(
      await chooseIdentityApi(
        request(),
        'a-folio-user-id',
        'auth0|0123456789abcdef01234567'
      )
    ).toBe(identityApiV2);
  });

  it('uses v1 when the toggle is off', async () => {
    mockToggles.mockReturnValue({ featureFlags: { identityApiV2: false } });

    expect(
      await chooseIdentityApi(request(), 'a-folio-user-id', 'auth0|p1234567')
    ).toBe(identityApiV1);
  });
});

describe('folioUserIdFromAccessToken', () => {
  it('reads the FOLIO user ID claim', () => {
    const token = sign({ [folioUserIdClaim]: 'a-folio-user-id' }, 'secret');

    expect(folioUserIdFromAccessToken(token)).toBe('a-folio-user-id');
  });

  it('returns nothing for a token without the claim', () => {
    const token = sign({ sub: 'auth0|p1234567' }, 'secret');

    expect(folioUserIdFromAccessToken(token)).toBeUndefined();
  });
});

describe('patronIp', () => {
  it('takes the address from CloudFront-Viewer-Address', () => {
    expect(
      patronIp(request({ 'cloudfront-viewer-address': '198.51.100.10:46532' }))
    ).toBe('198.51.100.10');
  });

  it('handles an IPv6 address', () => {
    expect(
      patronIp(request({ 'cloudfront-viewer-address': '2001:db8::1:46532' }))
    ).toBe('2001:db8::1');
  });

  it("doesn't trust X-Forwarded-For", () => {
    expect(
      patronIp(request({ 'x-forwarded-for': '203.0.113.7' }))
    ).toBeUndefined();
  });
});

describe('isAuth0StoredUser', () => {
  it('recognises a user Auth0 stores itself', () => {
    expect(isAuth0StoredUser('auth0|0123456789abcdef01234567')).toBe(true);
  });

  it('rejects a patron from Sierra', () => {
    expect(isAuth0StoredUser('auth0|p1234567')).toBe(false);
  });

  it('drops a value that is not a single address', () => {
    expect(
      patronIp(
        request({ 'cloudfront-viewer-address': '9.9.9.9, 198.51.100.10:46532' })
      )
    ).toBeUndefined();
  });

  it('drops an address with no port', () => {
    expect(
      patronIp(request({ 'cloudfront-viewer-address': '::1' }))
    ).toBeUndefined();
  });

  it('drops an IPv4 address with no port', () => {
    expect(
      patronIp(request({ 'cloudfront-viewer-address': '1.2.3.45' }))
    ).toBeUndefined();
  });
});
