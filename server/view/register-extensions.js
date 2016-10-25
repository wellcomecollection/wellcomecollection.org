const extensions = require('../extensions');

module.exports = (ctx, next) => {
  const env = ctx.viewEnv;
  extensions.forEach((extension, key) => env.addExtension(key, new extension(env)));
  return next();
}
