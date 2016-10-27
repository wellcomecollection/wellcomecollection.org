module.exports = (root) => {
  return (ctx, next) => {
    const nunjucks = require('nunjucks');
    // TODO: Find out why the devil we need to switch autoescaping off
    // when using the common lib as we already return a `safeString`
    const env = nunjucks.configure(root, {autoescape: false});
    ctx.viewEnv = env;
    return next();
  }
}
