const Koa = require('koa');
const config = require('./config');
const serve = require('koa-static');
const views = require('koa-views');
const Router = require('koa-router');
const controllers = require('./controllers');
const routing = require('./routes');

const app = module.exports = new Koa();

app.use(serve(config.static_dir.root,config.static_dir.options));
app.use(views(config.template.path, config.template.options));
app.use(routing(new Router, controllers));

app.listen(config.server.port);

console.info(`Server up and running on localhost: ${config.server.port}`);