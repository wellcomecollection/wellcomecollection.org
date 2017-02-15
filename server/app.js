import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import compress from 'koa-compress';
import {router} from './routes';
import render from './view/render';
import {enforceSSL} from './middleware/enforce-ssl';
import setCacheControl from './middleware/set-cache-control';

const app = new Koa();

app.use(setCacheControl(config.cacheControl));
app.use(compress(config.compress));
app.use(enforceSSL());
app.use(serve(config.static.path));
app.use(serve(config.favicon.path));
app.use(render(config.views.path));
app.use(router);

app.listen(config.server.port);

console.info(`Server up and running on http://localhost:${config.server.port}`);
