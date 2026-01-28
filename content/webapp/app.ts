/* eslint-disable @typescript-eslint/no-require-imports */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('content-server');
import { createServer } from 'http';
import next from 'next';

import { init as initServerData } from '@weco/common/server-data';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const appPromise = nextApp
  .prepare()
  .then(async () => {
    await initServerData();

    const server = createServer((req, res) => {
      if (req.url === '/management/healthcheck') {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }
      handle(req, res);
    });

    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

export default appPromise;
