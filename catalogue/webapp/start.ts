import appPromise, { timers } from './server';
import { clear as clearServerData } from '@weco/common/server-data';

const port = process.env.SERVER_PORT ?? 3000;

const serverPromise = appPromise
  .then(app => {
    const server = app.listen(port, () => {
      console.log(
        `> ${
          process.env.NODE_ENV || 'development'
        } ready on http://localhost:${port}/works`
      );
    });

    // We exit gracefully when we can.
    // The reason for not clearing intervals here, is we can't
    // feign the SIGTERM in the tests, but we can close the server.
    // This allows us to account for the real world shutdown, and test it
    const close = () => {
      server.close();
    };

    server.on('close', () => {
      clearServerData();
      for (const timer of timers) {
        clearInterval(timer);
      }
    });

    process.on('SIGTERM', close);
    process.on('SIGINT', close);

    return server;
  })
  .catch(err => {
    throw err;
  });

export default serverPromise;
