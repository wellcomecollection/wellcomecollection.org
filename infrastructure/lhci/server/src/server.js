const { createServer } = require('@lhci/server');

const serverPort = process.env.PORT;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const dbUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

console.log('Starting Lighthouse CI server...');
createServer({
  port: serverPort,
  storage: {
    storageMethod: 'sql',
    sqlDialect: 'mysql',
    sqlConnectionUrl: dbUrl,
  },
}).then(({ port }) => {
  console.log(`Server listening on ${port}`);
});
