import appPromise, { timers } from './app';
import { clear as clearServerDataTimers } from '@weco/common/server-data';

const port = process.env.PORT ?? 3000;

const serverPromise = appPromise.then(app => {
  const server = app.listen(port, () => {
    console.log(
      `> ${
        process.env.NODE_ENV || 'development'
      } ready on http://localhost:${port}/`
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
    clearServerDataTimers();
    for (const timer of timers) {
      clearInterval(timer);
    }
    process.exit(0);
  });

  process.on('SIGTERM', close);
  process.on('SIGINT', close);

  return server;
});

export default serverPromise;
