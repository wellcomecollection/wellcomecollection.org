import { StrategyOption } from 'passport-auth0';
import { opts as SessionOpts } from 'koa-session';

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Required environment variables.
  if (!process.env.KOA_SESSION_KEYS || process.env.KOA_SESSION_KEYS.trim() === '') {
    throw new Error(`Missing environment variable KOA_SESSION_KEYS`);
  }
  if (!process.env.AUTH0_CALLBACK_URL) {
    throw new Error(`Missing environment variables AUTH0_CALLBACK_URL`);
  }
}

export const port: any = process.env.SERVER_PORT || 3000;

// Any config derived from env here.

export const config = {
  // Random values used for signing cookies used for the session. Can be comma separated list.
  sessionKeys: process.env.KOA_SESSION_KEYS ? process.env.KOA_SESSION_KEYS.split(',') : ['local_value'],

  // Method, set to local for testing.
  authMethod: (isProduction ? 'auth0' : process.env.AUTH_METHOD || 'local') as 'auth0' | 'local',

  // Auth0 configuration.
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || `http://localhost:${port}/callback`,
  } as StrategyOption,

  session: {
    // Session / cookie options.
  } as Partial<SessionOpts>,

  testUser: isProduction
    ? undefined
    : {
        username: process.env.TEST_USER || 'test',
        password: process.env.TEST_PASSWORD || 'test',
      },

  remoteApi: {
    baseUrl: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
  } as { baseUrl: string, apiKey: string }
};

console.log('Base URL: ' + config.remoteApi.baseUrl);
console.log('API Key: ' + config.remoteApi.apiKey);
