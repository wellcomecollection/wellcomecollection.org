module.exports = {
  environment: process.env.APM_ENVIRONMENT,
  serverUrl: process.env.APM_SERVER_URL,
  // we've used inactive so by default it is on, and we can purposefully turn it off locally
  active: process.env.APM_INACTIVE !== 'true',
  centralConfig: true,
};
