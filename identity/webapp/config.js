require('dotenv').config();

const port = Number(process.env.PORT) || 3003;

// TODO do we still need this, could some be removed?
// Defaults (ie "build") need to be set here so that there's something available
// at build time - it never gets used
const getConfig = () => {
  return {
    // Random values used for encrypting cookies used for the session. Can be comma separated list.
    sessionKeys: process.env.SESSION_KEYS
      ? process.env.SESSION_KEYS.split(',')
      : ['build_keys'],

    // Versioning the session means that we can invalidate all users' sessions if we need to
    // eg if we change the claims on the identity token
    sessionVersion: 'v1',

    // The base URL of the whole website (eg https://wellcomecollection.org)
    siteBaseUrl: process.env.SITE_BASE_URL ?? `http://localhost:${port}`, // TODO why does this not get SITE_BASE_URL correctly?
    identityBasePath: '/account',

    // Auth0 configuration.
    auth0: {
      domain: process.env.AUTH0_DOMAIN || 'build',
      secret: process.env.AUTH0_SECRET || 'build', // TODO do we need this?
      clientID: process.env.AUTH0_CLIENT_ID || 'build',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'build',
      actionSecret: process.env.AUTH0_ACTION_SECRET || 'build',
    },

    remoteApi: {
      host: process.env.IDENTITY_API_HOST || 'build',
      apiKey: process.env.IDENTITY_API_KEY || 'build',
    },
  };
};

module.exports = { port, getConfig };
