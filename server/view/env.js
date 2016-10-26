module.exports = (root) => {
  return (ctx, next) => {
    const nunjucks = require('nunjucks');
    const env = nunjucks.configure(root);

    ctx.viewEnv = env;
    return next();
  }
}
