const { config: dotEnvConfig } = require('dotenv');

const port = Number(process.env.PORT) || 3000;

// Defaults (ie "build") need to be set here so that there's something available
// at build time - it never gets used
const getConfig = () => {
  dotEnvConfig();
  return {
    // Random values used for encrypting cookies used for the session. Can be comma separated list.
    sessionKeys: process.env.SESSION_KEYS
      ? process.env.SESSION_KEYS.split(',')
      : ['build_keys'],

    // The base URL of the whole website (eg https://wellcomecollection.org)
    siteBaseUrl: process.env.SITE_BASE_URL ?? `http://localhost:${port}`,
    identityBasePath: '/account',

    // Auth0 configuration.
    auth0: {
      domain: process.env.AUTH0_DOMAIN || 'build',
      clientID: process.env.AUTH0_CLIENT_ID || 'build',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'build',
    },

    remoteApi: {
      host: process.env.IDENTITY_API_HOST || 'build',
      apiKey: process.env.IDENTITY_API_KEY || 'build',
    },
  };
};

module.exports = { port, getConfig };
