const { createConfig } = require('@weco/common/next/next.config');

const { getConfig } = require('./config');

module.exports = createConfig({
  applicationName: 'identity',
  basePath: '/account',
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
