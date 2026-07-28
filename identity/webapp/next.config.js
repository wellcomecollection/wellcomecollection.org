const { createConfig } = require('@weco/common/next/next.config');

const { getConfig } = require('./config');

module.exports = createConfig({
  applicationName: 'identity',

  // Every URL this app serves gets '/account' added in front, e.g. the page at
  // /search is actually served at wellcomecollection.org/account/search. This
  // is how identity lives under the main site's domain instead of getting its
  // own subdomain.
  basePath: '/account',

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
