import type { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '../../src/utility/jwt-codec';
import axios from 'axios';
import getConfig from 'next/config';
import { authenticatedInstanceFactory } from 'src/utility/auth';
import jwt from 'jsonwebtoken';

const { serverRuntimeConfig: config } = getConfig();

function responseCodeIs(responseCode: number) {
  return (status: number) => status === responseCode;
}

// TODO: Stuff this in state somewhere, so we reuse the same instance
function getMachineToMachineInstance() {
  return authenticatedInstanceFactory(
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
          validateStatus: responseCodeIs(200),
        }
      );

      const accessToken = response.data.access_token;
      const decodedToken = jwt.decode(accessToken);
      if (
        decodedToken &&
        typeof decodedToken === 'object' &&
        decodedToken.exp
      ) {
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
}

// Guard clause that token is okay, but we don't care about anything more
// TODO: Proper comment and error messages here
// TODO: Test this function
function getUserIdFromToken(sessionToken: string): string {
  try {
    const token = decodeToken(sessionToken);

    if (typeof token === 'string') {
      throw new Error('BOOM!');
    }

    const { sub } = token;
    const userIdPrefix = /auth0\|p/;
    return sub.replace(userIdPrefix, '');
  } catch (error) {
    throw new Error(error);
  }
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

  if (
    !state ||
    !firstName ||
    !lastName ||
    !termsAndConditions ||
    !sessionToken
  ) {
    console.error('Missing required fields');
  }

  const userId = getUserIdFromToken(sessionToken);

  const redirectUri = `${config.auth0.domain}/continue?state=${state}`;

  try {
    const axios = await getMachineToMachineInstance()();

    axios
      .put(`/users/${userId}/registration`, {
        firstName,
        lastName,
      })
      .then(() => {
        res.redirect(302, `${redirectUri}`);
      })
      .catch(error => {
        console.error(error);
        res.redirect(302, `/account/error`);
      });
  } catch (error) {
    console.error(error);
    res.redirect(302, `/account/error`);
  }
};
