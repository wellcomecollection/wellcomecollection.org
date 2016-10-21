const Koa = require('koa');
const config = require('./config');
const serve = require('koa-static');
const views = require('koa-views');
const Router = require('koa-router');
const controllers = require('./controllers');
const routing = require('./routes');

const app = module.exports = new Koa();

app.use(serve(config.static_dir.root,config.static_dir.options));
app.use(function(ctx, next) {
  const nunjucks = require('nunjucks');
  const env = nunjucks.configure(`${__dirname}/views/`);
  env.addExtension('ComponentTag', new function() {
    this.tags = ['component'];
    this.parse = function(parser, nodes, lexer) {
      const token = parser.nextToken();

      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(token.value);

      const body = parser.parseUntilBlocks('endcomponent');
      parser.advanceAfterBlockEnd();
      return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context, name, data) {
      const html = env.render(`components/${name}/component.njk`, data);
      return new nunjucks.runtime.SafeString(html);
    };
  });
  // -----

  ctx.render = function(relPath, templateData) {
    return new Promise((resolve, reject) => {
      env.render(`${__dirname}/views/${relPath}.njk`, templateData, (err, res) => {
        if (err) {
          reject(err);
        } else {
          ctx.body = res;
          resolve(res);
        }
      });

    })
  };

  return next();
});
app.use(routing(new Router, controllers));

app.listen(config.server.port);

console.info(`Server up and running on localhost: ${config.server.port}`);
