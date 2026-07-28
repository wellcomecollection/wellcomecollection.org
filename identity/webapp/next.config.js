const { createConfig } = require('@weco/common/next/next.config');

const { getConfig } = require('./config');

// Every URL this app serves gets '/account' added in front, e.g. the page at
// /search is actually served at wellcomecollection.org/account/search. This
// is how identity lives under the main site's domain instead of getting its
// own subdomain.
const basePath = '/account';

// The auth0 SDK reads NEXT_PUBLIC_BASE_PATH to build URLs under the
// basePath (eg the OAuth callback URL). Setting it here keeps it in sync
// with basePath without requiring it in every environment's config: the
// assignment covers code that reads it at runtime (the SDK is unbundled in
// the server build), and the `env` key below covers code where it gets
// inlined at build time (the middleware bundle).
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const baseConfig = createConfig({
  applicationName: 'identity',
  basePath,

  // Passed into next.config.js here, then read back anywhere in this app's
  // server-side code via next/config's getConfig() - not by importing
  // ./config directly. See the serverRuntimeConfig comment in createConfig
  // (common/next/next.config.js) for why it works this way.
  serverRuntimeConfig: getConfig(),

  redirectEntries: [
    {
      // Without `basePath: false`, Next would automatically prefix
      // destination with '/account' too (since this app's basePath is
      // '/account'), sending people to /account/search instead of /search.
      source: '/account/search',
      destination: '/search',
      basePath: false,
      permanent: true,
    },
  ],
});

module.exports = (phase, context) => ({
  ...baseConfig(phase, context),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
});
