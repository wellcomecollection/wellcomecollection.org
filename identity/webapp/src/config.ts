import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Required environment variables.
  if (!process.env.SESSION_KEYS || process.env.SESSION_KEYS.trim() === '') {
    throw new Error(`Missing environment variable SESSION_KEYS`);
  }
  if (!process.env.SITE_BASE_URL) {
    throw new Error(`Missing environment variable SITE_BASE_URL`);
  }
}

export const port: any = process.env.PORT || 3000;

// Any config derived from env here.

export const config = {
  // Random values used for encrypting cookies used for the session. Can be comma separated list.
  sessionKeys: process.env.SESSION_KEYS
    ? process.env.SESSION_KEYS.split(',')
    : ['local_value'],

  // The base URL of the whole website (eg https://wellcomecollection.org)
  siteBaseUrl: process.env.SITE_BASE_URL ?? `http://localhost:${port}`,
  identityBasePath: '/account',

  // Auth0 configuration.
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },

  remoteApi: {
    host: process.env.IDENTITY_API_HOST,
    apiKey: process.env.IDENTITY_API_KEY,
  } as { host: string; apiKey: string },
};
