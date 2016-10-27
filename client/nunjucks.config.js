const nunjucks = require('nunjucks');
const extensions = require('common/extensions');

module.exports = (root) => {
  const env = nunjucks.configure(root);
  extensions.forEach((extension, key) => env.addExtension(key, new extension(env)));
  return env;
}
