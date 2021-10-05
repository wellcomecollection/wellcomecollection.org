const apm = require('elastic-apm-node');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // https://www.elastic.co/guide/en/apm/agent/nodejs/master/koa.html#koa-error-logging
    apm.captureError(error);
    throw error;
  }
};
