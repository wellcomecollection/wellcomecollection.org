import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';
import { getConfig } from '@weco/identity/config';
import { authenticatedInstanceFactory } from '@weco/identity/utils/auth';
import {
  chooseIdentityApi,
  IdentityApi,
  identityApiV1,
  identityApiV2,
  isAuth0StoredUser,
} from '@weco/identity/utils/identity-api';
import { decodeToken } from '@weco/identity/utils/jwt-codec';

const config = getConfig();

// v1 and v2 both accept tokens for v1's audience
const getClientCredentialsToken = async () => {
  const response = await fetchWithUndiciAgent(
    `https://${config.auth0.domain}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.auth0.clientID,
        client_secret: config.auth0.clientSecret,
        audience: config.remoteApi.audience,
        grant_type: 'client_credentials',
      }),
    }
  );

  if (response.status !== 200) {
    const errorBody = await response
      .text()
      .catch(() => 'Unable to read error body');
    throw new Error(
      `Failed to get OAuth token: ${response.status} ${response.statusText}. Body: ${errorBody}`
    );
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const decodedToken = jwt.decode(accessToken);
  if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
    return { accessToken, expiresAt: decodedToken.exp };
  } else {
    throw new Error("Can't extract expiry claim from token");
  }
};

const identityApiClientFor = (api: IdentityApi) =>
  authenticatedInstanceFactory(getClientCredentialsToken, () => ({
    baseURL: api.host,
    headers: {
      'x-api-key': api.apiKey,
    },
    timeout: 10 * 1000, // 10 seconds
  }));

const identityApiClients = new Map(
  [identityApiV1, identityApiV2]
    .filter((api): api is IdentityApi => api !== undefined)
    .map(api => [api, identityApiClientFor(api)])
);

/** Extracts the user ID and issuer from a session token, or throws if they
 * can't be retrieved.
 */
type TokenData = {
  userId: string;
  issuer: string;
};

export function getDataFromToken(
  sessionToken: string,
  secret: string,
  apiVersion: 1 | 2 = 1
): TokenData {
  const token = decodeToken(sessionToken, secret);

  if (typeof token === 'string') {
    throw new Error('Cannot get user ID from a token with a string payload');
  }

  const { sub, iss } = token;

  if (typeof sub !== 'string') {
    throw new Error('Cannot get user ID from payload');
  }
  if (typeof iss !== 'string') {
    throw new Error('Cannot get issuer from payload');
  }

  // v2 takes the Auth0 user ID without `auth0|`: `p` and the patron number,
  // or 24 hex characters for users stored by Auth0 itself
  if (apiVersion === 2) {
    const v2Prefix = 'auth0|';
    const userId = sub.startsWith(v2Prefix) ? sub.slice(v2Prefix.length) : '';
    if (!/^(p\d+|[a-f0-9]{24})$/.test(userId)) {
      throw new Error('Cannot get user ID from payload');
    }
    return { userId, issuer: iss };
  }

  // This is possibly over-defensive, but it's hard to imagine when we'd get
  // a user ID here which didn't start with this prefix -- so if we do, flag
  // it as an error for further investigation.
  const userIdPrefix = 'auth0|p';
  if (!sub.startsWith(userIdPrefix)) {
    throw new Error('Cannot get user ID from payload');
  }

  const userId = sub.replace(userIdPrefix, '');
  return { userId, issuer: iss };
}

// Set by the "Redirect to full registration" Auth0 Action for linked patrons
export function getSubFromToken(
  sessionToken: string,
  secret: string
): string | undefined {
  const token = decodeToken(sessionToken, secret);
  return typeof token === 'string' ? undefined : token.sub;
}

export function getFolioUserIdFromToken(
  sessionToken: string,
  secret: string
): string | undefined {
  const token = decodeToken(sessionToken, secret);
  const folioUserId =
    typeof token === 'string' ? undefined : token.folio_user_id;
  return typeof folioUserId === 'string' && folioUserId
    ? folioUserId
    : undefined;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    res.redirect('/account');
    return;
  }

  const { state, firstName, lastName, termsAndConditions, sessionToken } =
    req.body;

  // TODO: Test we'll fail if you get down here without these things,
  // because I broke it briefly :see_no_evil:
  if (
    !state ||
    !firstName ||
    !lastName ||
    !termsAndConditions ||
    !sessionToken
  ) {
    console.error('Missing required fields');
    res.redirect(302, '/account/error');
    return;
  }

  const secret = config.auth0.actionSecret;
  const api = await chooseIdentityApi(
    req,
    getFolioUserIdFromToken(sessionToken, secret)
  );
  if (
    api.version === 1 &&
    isAuth0StoredUser(getSubFromToken(sessionToken, secret))
  ) {
    res.redirect(302, '/account/error');
    return;
  }
  const { userId, issuer } = getDataFromToken(
    sessionToken,
    secret,
    api.version
  );
  const redirectUri = `https://${issuer}/continue?state=${state}`;

  try {
    const client = await identityApiClients.get(api)!();

    await client.put(`/users/${userId}/registration`, {
      firstName,
      lastName,
    });

    res.redirect(302, redirectUri);
  } catch (error) {
    console.error(error);
    res.redirect(302, '/account/error');
  }
};
