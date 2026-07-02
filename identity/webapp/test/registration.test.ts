import { getDataFromToken } from '@weco/identity/pages/api/registration';

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

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: {
    sessionKeys: 'test_test_test',
    siteBaseUrl: 'http://test.test',
    identityBasePath: '/account',
    auth0: {
      domain: 'test.test',
      clientID: 'test',
      clientSecret: 'test',
    },
    remoteApi: {
      host: 'test.test',
      apiKey: 'test',
    },
  },
}));
