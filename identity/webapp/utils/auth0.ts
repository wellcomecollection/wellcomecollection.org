import { AuthorizationError } from '@auth0/nextjs-auth0/errors';
import {
  Auth0Client,
  PageRoute,
  WithPageAuthRequiredPageRouterOptions,
} from '@auth0/nextjs-auth0/server';
import { GetServerSidePropsContext } from 'next';
import { NextResponse } from 'next/server';
import { ParsedUrlQuery } from 'querystring';

// This module is imported by middleware.ts, which Next.js bundles for the
// edge runtime where `next/config` (serverRuntimeConfig) is unavailable, so
// configuration is read straight from the environment. The fallbacks mirror
// config.js: real values are never needed at build time.
const port = Number(process.env.PORT) || 3000;
export const siteBaseUrl =
  process.env.SITE_BASE_URL ?? `http://localhost:${port}`;
export const identityBasePath = '/account';

const sessionKeys = process.env.SESSION_KEYS
  ? process.env.SESSION_KEYS.split(',')
  : ['build_keys'];

// Versioning the session means that we can invalidate all users' sessions if
// we need to, eg if we change the claims on the identity token
const sessionVersion = 'v1';

export const auth0Domain = process.env.AUTH0_DOMAIN || 'build';

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

const ONE_HOUR_S = 60 * 60;
const ONE_DAY_S = 24 * ONE_HOUR_S;

/*
 * !!!IMPORTANT!!!
 * Always import auth0 from here! It's a singleton instance, and importing it elsewhere
 * as in the docs (ie from the npm package) will not work!
 */
const auth0 = new Auth0Client({
  domain: auth0Domain,
  clientId: process.env.AUTH0_CLIENT_ID || 'build',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'build',
  // v4 only supports a single secret, not the v3 list of rotatable keys.
  // Rotating SESSION_KEYS now signs everybody out (sessions last 7 days max).
  secret: sessionKeys[0],
  // The origin only: the /account prefix comes from NEXT_PUBLIC_BASE_PATH,
  // which the SDK applies when building its own URLs (eg the callback URL)
  appBaseUrl: siteBaseUrl,
  authorizationParameters: {
    audience: process.env.IDENTITY_API_HOST || 'build',
    scope: [...utilityScopes, ...profileScopes, ...identityApiScopes].join(' '),
  },
  // Where a plain login (no returnTo, eg the header sign-in link) lands.
  // Resolved against the site origin by onCallback below.
  signInReturnToPath: identityBasePath,
  // Keep the same public URLs as v3 so that links in other webapps and the
  // callback/logout URLs registered with the Auth0 tenant keep working.
  // (/api/auth/me is served by pages/api/auth/me.ts, not by the SDK.)
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
  },
  session: {
    rolling: true, // Session expiry time is reset every time the user interacts with the server
    absoluteDuration: 7 * ONE_DAY_S, // 1 week
    inactivityDuration: 8 * ONE_HOUR_S, // 8 hours
    cookie: {
      name: `wecoIdentitySession_${sessionVersion}`,
      // The default would be NEXT_PUBLIC_BASE_PATH; v3 set the cookie on /
      path: '/',
    },
  },
  // v4 keeps only the default OIDC claims on session.user; v3 kept every
  // ID-token claim, and the rest of the site relies on the namespaced
  // wellcomecollection.org claims (patron_barcode, patron_role)
  beforeSessionSaved: async session => session,
  onCallback: async (error, ctx) => {
    const baseUrl = ctx.appBaseUrl ?? siteBaseUrl;

    if (error) {
      // Auth0 redirected back to us with an error (eg a user cancelling a
      // flow gives ?error=access_denied): show it on our error page
      if (error instanceof AuthorizationError) {
        const params = new URLSearchParams({
          error: error.cause.code,
          error_description: error.cause.message,
        });
        return NextResponse.redirect(
          new URL(`${identityBasePath}/error?${params}`, baseUrl)
        );
      }

      // Anything else, eg somebody sending a deliberately malformed token or
      // code. We deliberately omit the error message from the user-facing
      // response: I don't think anybody will encounter this in normal
      // running, and I'm not sure if that message could leak sensitive info.
      console.warn(`Error in the Auth0 callback: ${error.message}`);
      return new NextResponse('Something went wrong in the Auth0 callback', {
        status: 500,
      });
    }

    // We can't use the SDK's default redirect here: it prefixes
    // NEXT_PUBLIC_BASE_PATH onto returnTo, but logins started from other
    // webapps return to pages outside /account (eg /works/xyz)
    return NextResponse.redirect(
      new URL(ctx.returnTo || identityBasePath, baseUrl)
    );
  },
});

// Wrapping the built-in method in order to preserve basePath: the SDK works
// from ctx.resolvedUrl, which doesn't include it
export const withPageAuthRequiredSSR =
  <P extends { [key: string]: unknown }>(
    opts: WithPageAuthRequiredPageRouterOptions<P> = {}
  ): PageRoute<P, ParsedUrlQuery> =>
  (ctx: GetServerSidePropsContext) =>
    auth0.withPageAuthRequired<P>({
      ...opts,
      returnTo: identityBasePath + (opts.returnTo ?? ctx.resolvedUrl),
    })(ctx);

export default auth0;
