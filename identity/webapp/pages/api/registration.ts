import axios from 'axios';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

import { authenticatedInstanceFactory } from '@weco/identity/utils/auth';
import { decodeToken } from '@weco/identity/utils/jwt-codec';

const { serverRuntimeConfig: config } = getConfig();
// TODO update anything in here?
const identityApiClient = authenticatedInstanceFactory(
  async () => {
    const response = await axios.post(
      `https://${config.auth0.domain}/oauth/token`,
      {
        client_id: config.auth0.clientID,
        client_secret: config.auth0.clientSecret,
        audience: config.remoteApi.host,
        grant_type: 'client_credentials',
      },
      {
        validateStatus: (status: number) => status === 200,
      }
    );

    const accessToken = response.data.access_token;
    const decodedToken = jwt.decode(accessToken);
    if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
      return { accessToken, expiresAt: decodedToken.exp };
    } else {
      throw new Error("Can't extract expiry claim from token");
    }
  },
  () => ({
    baseURL: config.remoteApi.host,
    headers: {
      'x-api-key': config.remoteApi.apiKey,
    },
    timeout: 10 * 1000, // 10 seconds
  })
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
  secret: string
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
  const { userId, issuer } = getDataFromToken(sessionToken, secret);
  const redirectUri = `https://${issuer}/continue?state=${state}`;

  try {
    const axios = await identityApiClient();

    await axios.put(`/users/${userId}/registration`, {
      firstName,
      lastName,
    });

    res.redirect(302, redirectUri);
  } catch (error) {
    console.error(error);
    res.redirect(302, '/account/error');
  }
};
