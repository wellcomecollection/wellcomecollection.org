import apmConfig from './apmConfig';

function initApm(serviceName: string): void {
  const config = apmConfig.server(serviceName);
  if (process.env.NODE_ENV !== 'test' && config.serverUrl) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('elastic-apm-node').start(config);
  }
}

// This needs to be the first module loaded in the application
module.exports = initApm;
