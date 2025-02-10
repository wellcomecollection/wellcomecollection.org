import { clear as clearServerDataTimers } from '@weco/common/server-data';

import appPromise from './app';

const port = process.env.PORT ?? 3000;

const serverPromise = appPromise.then(app => {
  const server = app.listen(port, () => {
    const inDev = process.env.NODE_ENV === 'development';
    const devMessage =
      '(NODE_ENV === development, also try https://www-dev.wellcomecollection.org )';

    console.log(`> ready on localhost:${port} ${inDev ? devMessage : ''}`);
  });

  // We exit gracefully when we can.
  // The reason for not clearing intervals here, is we can't
  // feign the SIGTERM in the tests, but we can close the server.
  // This allows us to account for the real world shutdown, and test it
  const close = () => {
    server.close();
    process.exit(0);
  };

  server.on('close', () => {
    clearServerDataTimers();
  });

  process.on('SIGTERM', close);
  process.on('SIGINT', close);

  return server;
});

export default serverPromise;
