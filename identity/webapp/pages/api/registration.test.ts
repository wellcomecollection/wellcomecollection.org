import { getUserIdFromToken } from './registration';

describe('getUserIdFromToken', () => {
  it('rejects an invalid token', () => {
    const token = 'this_is.not_a.valid_jwt';
    const secret = '123';

    expect(() => getUserIdFromToken(token, secret)).toThrow(
      'Invalid session_token in decode'
    );
  });

  it('rejects a token which is a string', () => {
    // This token was created using https://jwt.io/ with the payload
    // "\"hello world\"""
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ImhlbGxvIHdvcmxkIg.tJ6vz_pS3m2q1sfp1o5VBg0aDLM1-7PMK33SUx7fePQ';
    const secret = '123';

    expect(() => getUserIdFromToken(token, secret)).toThrow(
      'Cannot get user ID from a token with a string payload'
    );
  });

  it('extracts the user ID from a payload', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": "auth0|p1234567"
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHxwMTIzNDU2NyJ9.3x0oPrTuo4dDe1hOKX_5ARksY26nDtd2P1w7gJm9R2I';
    const secret = '123';

    expect(getUserIdFromToken(token, secret)).toBe('1234567');
  });

  it('rejects a payload with a malformed user ID', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": "not a real user ID"
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJub3QgYSByZWFsIHVzZXIgSUQifQ.H5ElnFhsN7gi7dEWejxg31ct6OrSxOAMYQUxMxqVmAc';
    const secret = '123';

    expect(() => getUserIdFromToken(token, secret)).toThrow(
      'Cannot get user ID from payload'
    );
  });

  it('rejects a payload with a missing user ID', () => {
    // This token was created using https://jwt.io/ with the payload
    //
    //    {
    //      "sub": null
    //    }
    //
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOm51bGx9.b9vr1ufzq2J4fhsmtyhSlezJNAIhCL8ZIgVnWV19WBs';
    const secret = '123';

    expect(() => getUserIdFromToken(token, secret)).toThrow(
      'Cannot get user ID from payload'
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
