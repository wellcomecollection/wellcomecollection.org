const apmConfig = require('./apmConfig');

// This needs to be the first module loaded in the application
module.exports = serviceName => {
  const config = apmConfig.server(serviceName);
  if (process.env.NODE_ENV !== 'test' && config.serverUrl) {
    require('elastic-apm-node').start(config);
  }
};
