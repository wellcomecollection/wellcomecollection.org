import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import {router} from './routes';
import render from './view/render';

const app = new Koa();

app.use(serve(config.static_dir.root,config.static_dir.options));
app.use(render(config.views.path));
app.use(router);

app.listen(config.server.port);

console.info(`Server up and running on http://localhost:${config.server.port}`);
