import { sign } from 'jsonwebtoken';

import {
  getDataFromToken,
  getFolioUserIdFromToken,
} from '@weco/identity/pages/api/registration';

// server-data refuses to load outside a server, and jest runs these in jsdom
jest.mock('@weco/common/server-data', () => ({
  getCachedToggles: jest.fn(),
}));
jest.mock('@weco/common/server-data/toggles', () => ({
  getTogglesFromContext: jest.fn(),
}));

describe('getDataFromToken', () => {
  it('rejects an invalid token', () => {
    const token = 'this_is.not_a.valid_jwt';
    const secret = '123';

    expect(() => getDataFromToken(token, secret)).toThrow(
      'Invalid session_token in decode'
    );
  });

  it('rejects a token which is a string', () => {
    // This token was created using https://jwt.io/ with the payload
    // "\"hello world\"""
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ImhlbGxvIHdvcmxkIg.tJ6vz_pS3m2q1sfp1o5VBg0aDLM1-7PMK33SUx7fePQ';
    const secret = '123';

    expect(() => getDataFromToken(token, secret)).toThrow(
      'Cannot get user ID from a token with a string payload'
    );
  });

  it('extracts the data from a payload', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": "auth0|p1234567",
    //      "iss": "wellcome.test"
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHxwMTIzNDU2NyIsImlzcyI6IndlbGxjb21lLnRlc3QifQ.wlX8dLxzNlZZ0Lw4ga6rCCpw4L83Z261TKTJTsSdWTU';
    const secret = '123';

    expect(getDataFromToken(token, secret)).toEqual({
      userId: '1234567',
      issuer: 'wellcome.test',
    });
  });

  it('rejects a payload with a malformed user ID', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": "not a real user id",
    //      "iss": "wellcome.test"
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJub3QgYSByZWFsIHVzZXIgaWQiLCJpc3MiOiJ3ZWxsY29tZS50ZXN0In0._a6xL2QwbkB367pjJhCWalosXKlz-AFuvOyctp5Jv78';
    const secret = '123';

    expect(() => getDataFromToken(token, secret)).toThrow(
      'Cannot get user ID from payload'
    );
  });

  it('rejects a payload with a missing user ID', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": null,
    //      "iss": "wellcome.test"
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOm51bGwsImlzcyI6IndlbGxjb21lLnRlc3QifQ.9urMyL3uXHyjn0j3Fjyi99vpaJEeHIJDzrBiEIKKW-I';
    const secret = '123';

    expect(() => getDataFromToken(token, secret)).toThrow(
      'Cannot get user ID from payload'
    );
  });

  it('rejects a payload with a missing issuer', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": "auth0|p1234567",
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHxwMTIzNDU2NyJ9.3x0oPrTuo4dDe1hOKX_5ARksY26nDtd2P1w7gJm9R2I';
    const secret = '123';

    expect(() => getDataFromToken(token, secret)).toThrow(
      'Cannot get issuer from payload'
    );
  });
});

jest.mock('@weco/identity/config', () => ({
  getConfig: () => ({
    auth0: {
      domain: 'test.test',
      clientID: 'test',
      clientSecret: 'test',
    },
    remoteApi: {
      host: 'test.test',
      apiKey: 'test',
    },
  }),
}));

describe('getDataFromToken for the v2 identity API', () => {
  const secret = '123';

  it('removes only the auth0| prefix from a Sierra patron', () => {
    const token = sign({ sub: 'auth0|p1234567', iss: 'wellcome.test' }, secret);

    expect(getDataFromToken(token, secret, 2)).toEqual({
      userId: 'p1234567',
      issuer: 'wellcome.test',
    });
  });

  it('accepts a user stored by Auth0 itself', () => {
    const token = sign(
      { sub: 'auth0|0123456789abcdef01234567', iss: 'wellcome.test' },
      secret
    );

    expect(getDataFromToken(token, secret, 2)).toEqual({
      userId: '0123456789abcdef01234567',
      issuer: 'wellcome.test',
    });
  });

  it('rejects any other user ID', () => {
    const token = sign(
      { sub: 'auth0|not-a-user', iss: 'wellcome.test' },
      secret
    );

    expect(() => getDataFromToken(token, secret, 2)).toThrow(
      'Cannot get user ID from payload'
    );
  });
});

describe('getFolioUserIdFromToken', () => {
  const secret = '123';

  it('returns the FOLIO user ID when the token has one', () => {
    const token = sign(
      { sub: 'auth0|p1234567', folio_user_id: 'a-folio-user-id' },
      secret
    );

    expect(getFolioUserIdFromToken(token, secret)).toBe('a-folio-user-id');
  });

  it('returns nothing when the token has none', () => {
    const token = sign({ sub: 'auth0|p1234567' }, secret);

    expect(getFolioUserIdFromToken(token, secret)).toBeUndefined();
  });
});
