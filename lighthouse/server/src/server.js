const { createApp } = require('@lhci/server');
const express = require('express');
const basicAuth = require('express-basic-auth');

const serverPort = process.env.PORT;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

const basicAuthMiddleware = basicAuth({
  users: { [adminUser]: adminPassword },
});

// 2 minute timeout to acquire a connection, to account for
// Aurora Serverless warmup worst case scenario
const sqlConnectionTimeout = 2 * 60 * 1000;

async function main() {
  const app = express();
  const { app: lhciApp } = await createApp({
    storage: {
      storageMethod: 'sql',
      sqlDialect: 'mysql',
      sqlConnectionUrl: dbUrl,
      sqlDialectOptions: {
        connectTimeout: sqlConnectionTimeout,
      },
      sequelizeOptions: {
        pool: {
          acquire: sqlConnectionTimeout,
        },
      },
    },
  });

  // The only endpoint we want to protect is the one to create a new project
  // as this doesn't require an admin token.
  app.post('/v1/projects', basicAuthMiddleware);
  app.use(lhciApp);

  console.log('Starting Lighthouse CI server...');
  const server = await app.listen(serverPort);
  console.log(`Server listening on ${serverPort}`);

  // The below is taken from https://github.com/GoogleChrome/lighthouse-ci/blob/main/packages/server/src/server.js#L81-L93

  // Node default socket timeout is 2 minutes.
  // Some LHCI API operations (computing statistics) can take longer than that under heavy load.
  // Set the timeout even higher to allow for these requests to complete.
  server.on('connection', socket => {
    socket.setTimeout(20 * 60 * 1000); // 20 minutes
    socket.on('timeout', () => {
      process.stdout.write(`${new Date().toISOString()} - socket timed out\n`);
      socket.end();
    });
  });
}

main();
