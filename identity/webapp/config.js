const { config: dotEnvConfig } = require('dotenv');

const port = Number(process.env.PORT) || 3000;

// Defaults (ie "test") need to be set here so that there's something available
// at build time - it never gets used
const getConfig = () => {
  dotEnvConfig();
  return {
    // Random values used for encrypting cookies used for the session. Can be comma separated list.
    sessionKeys: process.env.SESSION_KEYS
      ? process.env.SESSION_KEYS.split(',')
      : ['test_keys'],

    // The base URL of the whole website (eg https://wellcomecollection.org)
    siteBaseUrl: process.env.SITE_BASE_URL ?? `http://localhost:${port}`,
    identityBasePath: '/account',

    // Auth0 configuration.
    auth0: {
      domain: process.env.AUTH0_DOMAIN || 'test',
      clientID: process.env.AUTH0_CLIENT_ID || 'test',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'test',
    },

    remoteApi: {
      host: process.env.IDENTITY_API_HOST || 'test',
      apiKey: process.env.IDENTITY_API_KEY || 'test',
    },
  };
};

module.exports = { port, getConfig };
