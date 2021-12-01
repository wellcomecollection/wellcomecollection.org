import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Required environment variables.
  if (
    !process.env.KOA_SESSION_KEYS ||
    process.env.KOA_SESSION_KEYS.trim() === ''
  ) {
    throw new Error(`Missing environment variable KOA_SESSION_KEYS`);
  }
  if (!process.env.AUTH0_CALLBACK_URL) {
    throw new Error(`Missing environment variables AUTH0_CALLBACK_URL`);
  }
}

export const port: any = process.env.PORT || 3000;

// Any config derived from env here.

export const config = {
  // Random values used for signing cookies used for the session. Can be comma separated list.
  sessionKeys: process.env.KOA_SESSION_KEYS
    ? process.env.KOA_SESSION_KEYS.split(',')
    : ['local_value'],

  // Auth0 configuration.
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL ||
      `http://localhost:${port}/account/callback`,
  },

  logout: {
    redirectUrl: process.env.LOGOUT_REDIRECT_URL,
  },

  testUser: isProduction
    ? undefined
    : {
        username: process.env.TEST_USER || 'test',
        password: process.env.TEST_PASSWORD || 'test',
      },

  remoteApi: {
    host: process.env.IDENTITY_API_HOST,
    apiKey: process.env.IDENTITY_API_KEY,
  } as { host: string; apiKey: string },
};
