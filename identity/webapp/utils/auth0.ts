// TODO ADDRESS THIS PROPERLY https://github.com/wellcomecollection/wellcomecollection.org/issues/10980
// eslint-disable-next-line
// @ts-nocheck
// import {
//   initAuth0,
//   PageRoute,
//   WithPageAuthRequiredPageRouterOptions,
// } from '@auth0/nextjs-auth0';
// import { GetServerSidePropsContext } from 'next';
// import getConfig from 'next/config';
// import { ParsedUrlQuery } from 'querystring';

// const { serverRuntimeConfig } = getConfig();
// const config = serverRuntimeConfig as {
//   sessionKeys: string[];
//   sessionVersion: string;
//   siteBaseUrl: string;
//   identityBasePath: string;
//   auth0: {
//     domain: string;
//     clientID: string;
//     clientSecret: string;
//   };
//   remoteApi: {
//     host: string;
//     apiKey: string;
//   };
// };

// const identityApiScopes = [
//   'create:requests',
//   'delete:patron',
//   'read:user',
//   'read:requests',
//   'send:verification-emails',
//   'update:email',
//   'update:password',
// ];

// const utilityScopes = [
//   'openid', // Required, also gives the token access to the userinfo endpoint
//   'offline_access', // Enables refresh tokens
// ];

// Things we want in the JWT
//
// Are you here because you want to change 'profile' to something more specific?
// Are you now confused because even though you've asked for given_name, it's not in the token?
// Be aware that these are *scopes*, so while you can see lovely granular *claims* here:
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
// you can actually only ask for quite general *scopes*:
// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
// const profileScopes = [
//   'profile',
//   'email',
//   'weco:patron_barcode',
//   'weco:patron_role',
// ];

// const identityAuthorizationParams = {
//   audience: {
//     host: process.env.IDENTITY_API_HOST || 'build',
//     apiKey: process.env.IDENTITY_API_KEY || 'build',
//   },
//   scope: [...utilityScopes, ...profileScopes, ...identityApiScopes].join(' '),
// };

// const ONE_HOUR_S = 60 * 60;
// const ONE_DAY_S = 24 * ONE_HOUR_S;

/*
 * !!!IMPORTANT!!!
 * Always import auth0 from here! It's a singleton instance, and importing it elsewhere
 * as in the docs (ie from the npm package) will not work!
 */

// See https://auth0.github.io/nextjs-auth0/modules/config.html
// Old version was here
// const auth0 = initAuth0({
//   authorizationParams: {
//     response_type: 'code',
//     ...identityAuthorizationParams,
//   },
//   baseURL: config.siteBaseUrl + config.identityBasePath,
//   clientID: config.auth0.clientID,
//   clientSecret: config.auth0.clientSecret,
//   issuerBaseURL: `https://${config.auth0.domain}`,
//   routes: {
//     postLogoutRedirect: config.siteBaseUrl,
//   },
//   secret: config.sessionKeys,
//   session: {
//     rolling: true, // Session expiry time is reset every time the user interacts with the server
//     absoluteDuration: 7 * ONE_DAY_S, // 1 week
//     rollingDuration: 8 * ONE_HOUR_S, // 8 hours
//     name: `wecoIdentitySession_${config.sessionVersion}`,
//   },
// });

// Wrapping the built-in method as per https://github.com/auth0/nextjs-auth0#base-path-and-internationalized-routing
// in order to preserve basePath
// export const withPageAuthRequiredSSR =
//   <P>(
//     opts?: WithPageAuthRequiredPageRouterOptions<P>
//   ): PageRoute<P, ParsedUrlQuery> =>
//   (ctx: GetServerSidePropsContext) =>
//     auth0.withPageAuthRequired<P>({
//       ...opts,
//       returnTo: config.identityBasePath + (opts.returnTo ?? ctx.resolvedUrl),
//     })(ctx);

// export default auth0;
