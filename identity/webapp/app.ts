// This needs to be the first module loaded in the application
/* eslint-disable @typescript-eslint/no-require-imports */
require('@weco/common/services/apm/initApm')('identity-server');

import { createServer } from 'http';
import next from 'next';

import { init as initServerData } from '@weco/common/server-data';

export async function createApp() {
  const isProduction = process.env.NODE_ENV === 'production';
  await initServerData();

  const nextApp = next({
    dev: !isProduction,
  });
  await nextApp.prepare();
  const nextHandler = nextApp.getRequestHandler();

  const server = createServer((req, res) => {
    if (req.url === '/management/healthcheck') {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    nextHandler(req, res);
  });

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    server.close();
    process.exit(0);
  });

  return server;
}
