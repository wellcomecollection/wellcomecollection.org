import type { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '../../src/utility/jwt-codec';
import axios from 'axios';
import getConfig from 'next/config';
import { authenticatedInstanceFactory } from '../../src/utility/auth';
import jwt from 'jsonwebtoken';

const { serverRuntimeConfig: config } = getConfig();

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

/** Extracts the user ID from a session token, or throws if the user ID
 * can't be retrieved.
 */
export function getUserIdFromToken(
  sessionToken: string,
  secret: string
): string {
  const token = decodeToken(sessionToken, secret);

  if (typeof token === 'string') {
    throw new Error('Cannot get user ID from a token with a string payload');
  }

  const { sub } = token;

  if (typeof sub !== 'string') {
    throw new Error('Cannot get user ID from payload');
  }

  // This is possibly over-defensive, but it's hard to imagine when we'd get
  // a user ID here which didn't start with this prefix -- so if we do, flag
  // it as an error for further investigation.
  const userIdPrefix = 'auth0|p';
  if (!sub.startsWith(userIdPrefix)) {
    throw new Error('Cannot get user ID from payload');
  }

  return sub.replace(userIdPrefix, '');
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
    res.redirect(302, `/account/error`);
    return;
  }

  const secret = config.auth0.actionSecret;
  const userId = getUserIdFromToken(sessionToken, secret);

  const redirectUri = `https://${config.auth0.domain}/continue?state=${state}`;

  try {
    const axios = await identityApiClient();

    await axios.put(`/users/${userId}/registration`, {
      firstName,
      lastName,
    });

    res.redirect(302, redirectUri);
  } catch (error) {
    console.error(error);
    res.redirect(302, `/account/error`);
  }
};
