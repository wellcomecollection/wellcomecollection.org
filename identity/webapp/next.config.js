const { createConfig } = require('@weco/common/next/next.config');

const { getConfig } = require('./config');

module.exports = createConfig({
  applicationName: 'identity',

  // Mounts this app at wellcomecollection.org/account rather than its own subdomain.
  basePath: '/account',

  // Read back in page/api code via next/config's getConfig(), not by importing
  // ./config directly - see the comment on serverRuntimeConfig in createConfig.
  serverRuntimeConfig: getConfig(),

  redirectEntries: [
    {
      // does not add /account since basePath: false is set
      source: '/account/search',
      destination: '/search',
      basePath: false,
      permanent: true,
    },
  ],
});
