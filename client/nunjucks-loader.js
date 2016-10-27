const nunjucks = require('nunjucks');
const loaderUtils = require('loader-utils');
const extensions = require('common/extensions');


module.exports = function(source) {
  this.cacheable();
  const config = loaderUtils.getLoaderConfig(this, 'nunjucks-loader');
  const path = config.path || [];
  const env = nunjucks.configure(path);
  extensions.forEach((extension, key) => env.addExtension(key, new extension(env)));
  const name = this.resourcePath;
  const s = nunjucks.precompileString(source, {
    name: this.resourcePath,
    env
  });

  const script = `
    const nunjucks = require('nunjucks/browser/nunjucks-slim');
    module.exports = function(data) {
        ${s};
        nunjucks.render('${name}', data);
    }
  `;
  // console.info(script);


  return script;
}
