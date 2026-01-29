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
    // Handle healthcheck at the server level
    // Note: There's also a Next.js API route at pages/api/management/healthcheck.ts
    // but we need this inline handler because the /management/healthcheck path is
    // accessed directly at the server level (before Next.js routing) for load balancer
    // health checks and container orchestration.
    if (req.url === '/management/healthcheck') {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    nextHandler(req, res);
  });

  process.on('SIGINT', () => {
    // Close any connections and clean up, then exit when done.
    server.close(err => {
      // If an error occurs while closing, use a non-zero exit code.
      process.exit(err ? 1 : 0);
    });
  });

  return server;
}
