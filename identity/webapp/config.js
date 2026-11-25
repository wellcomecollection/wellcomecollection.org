require('dotenv').config();

const port = Number(process.env.PORT) || 3000;

// Defaults (ie "build") need to be set here so that there's something available
// at build time - it never gets used
//
// Server-side only: this holds secrets, so only import it from API routes,
// getServerSideProps or other server-only modules.
//
// The Auth0 SDK and session configuration lives separately in utils/auth0.ts,
// which reads the environment directly because it's also loaded by
// proxy.ts.
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
      // The API that access tokens are requested for. v2 accepts v1's tokens,
      // so this stays v1's identifier whichever API a request goes to.
      audience:
        process.env.IDENTITY_API_AUDIENCE ||
        process.env.IDENTITY_API_HOST ||
        'build',
    },

    // Unset where v2 doesn't exist (see utils/identity-api.ts)
    remoteApiV2:
      process.env.IDENTITY_API_V2_HOST && process.env.IDENTITY_API_V2_KEY
        ? {
            host: process.env.IDENTITY_API_V2_HOST,
            apiKey: process.env.IDENTITY_API_V2_KEY,
          }
        : undefined,
  };
};

module.exports = { port, getConfig };
