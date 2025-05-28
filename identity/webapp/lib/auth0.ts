import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { Auth0ClientOptions, SessionData } from '@auth0/nextjs-auth0/types';

const ONE_HOUR_S = 60 * 60;
const ONE_DAY_S = 24 * ONE_HOUR_S;

const identityApiScopes = [
  'create:requests',
  'delete:patron',
  'read:user',
  'read:requests',
  'send:verification-emails',
  'update:email',
  'update:password',
];

const utilityScopes = [
  'openid', // Required, also gives the token access to the userinfo endpoint
  'offline_access', // Enables refresh tokens
];

// Things we want in the JWT
//
// Are you here because you want to change 'profile' to something more specific?
// Are you now confused because even though you've asked for given_name, it's not in the token?
// Be aware that these are *scopes*, so while you can see lovely granular *claims* here:
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
// you can actually only ask for quite general *scopes*:
// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
const profileScopes = [
  'profile',
  'email',
  'weco:patron_barcode',
  'weco:patron_role',
];

const auth0ClientOptions: Auth0ClientOptions = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // This seems to be required to get all the claims in the JWT
  // even though it looks like it doesn't do anything
  beforeSessionSaved: async (session: SessionData): Promise<SessionData> => ({
    ...session,
  }),
  authorizationParameters: {
    // audience: {
    //   host: process.env.IDENTITY_API_HOST || 'build',
    //   apiKey: process.env.IDENTITY_API_KEY || 'build',
    // }, ??????
    scope: [...utilityScopes, ...profileScopes, ...identityApiScopes].join(' '),
  },
  appBaseUrl:
    (process.env.SITE_BASE_URL || `http://localhost:3003`) + '/account',
  secret: process.env.AUTH0_SECRET, // TODO add in env variables
  signInReturnToPath:
    (process.env.SITE_BASE_URL || `http://localhost:3003`) + '/account', // TODO
  session: {
    rolling: true, // Session expiry time is reset every time the user interacts with the server
    absoluteDuration: 7 * ONE_DAY_S, // 1 week
    inactivityDuration: 8 * ONE_HOUR_S, // 8 hours
  },
};

export const auth0 = new Auth0Client(auth0ClientOptions);
