// This needs to be the first module loaded in the application
if (process.env.NODE_ENV !== 'test') {
  require('elastic-apm-node').start({
    serviceName: process.env.NEXT_PUBLIC_APM_SERVICE_NAME,
    ...require('@weco/common/services/apm/apmConfig'),
  });
}
