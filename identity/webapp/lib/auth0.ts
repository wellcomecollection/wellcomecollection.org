import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { Auth0ClientOptions } from '@auth0/nextjs-auth0/types';

import { identityAuthorizationParams } from '@weco/identity/utils/auth0';

const ONE_HOUR_S = 60 * 60;
const ONE_DAY_S = 24 * ONE_HOUR_S;

const auth0ClientOptions: Auth0ClientOptions = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParameters: {
    ...identityAuthorizationParams,
  },
  appBaseUrl:
    (process.env.SITE_BASE_URL || `http://localhost:3002`) + '/account',
  secret: process.env.AUTH0_SECRET, // TODO add in env variables
  signInReturnToPath:
    (process.env.SITE_BASE_URL || `http://localhost:3002`) + '/account', // TODO
  session: {
    rolling: true, // Session expiry time is reset every time the user interacts with the server
    absoluteDuration: 7 * ONE_DAY_S, // 1 week
    inactivityDuration: 8 * ONE_HOUR_S, // 8 hours
  },
};

export const auth0 = new Auth0Client(auth0ClientOptions);
