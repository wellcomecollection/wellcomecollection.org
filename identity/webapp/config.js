require('dotenv').config();

const port = Number(process.env.PORT) || 3000;

// Defaults (ie "build") need to be set here so that there's something available
// at build time - it never gets used
//
// The Auth0 SDK and session configuration lives in utils/auth0.ts, which
// reads the environment directly: it's also loaded by middleware.ts, where
// next/config isn't available.
const getConfig = () => {
  return {
    // Auth0 configuration.
    auth0: {
      domain: process.env.AUTH0_DOMAIN || 'build',
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
