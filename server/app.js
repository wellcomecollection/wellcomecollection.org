const Koa = require('koa');
const config = require('./config');
const serve = require('koa-static');
const Router = require('koa-router');
const controllers = require('./controllers');
const routing = require('./routes');
const viewEnv = require('./view/env');
const registerExtensions = require('./view/register-extensions');
const viewRender = require('./view/render');

const app = module.exports = new Koa();

app.use(serve(config.static_dir.root,config.static_dir.options));
app.use(viewEnv(config.views.root));
app.use(registerExtensions)
app.use(viewRender);
app.use(routing(new Router, controllers));

app.listen(config.server.port);

console.info(`Server up and running on localhost: ${config.server.port}`);
