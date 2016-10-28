import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import views from 'koa-views';
import Router from 'koa-router';
import controllers from './controllers';
import routing from './routes';
import render from './view/render';

const app = module.exports = new Koa();

app.use(serve(config.static_dir.root,config.static_dir.options));
app.use(render(config.views.path));
app.use(routing(new Router, controllers));

app.listen(config.server.port);

console.info(`Server up and running on localhost: ${config.server.port}`);
