import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import {router} from './routes';
import render from './view/render';
import {enforceSSL} from './middleware/enforce-ssl';
import setCacheControl from './middleware/set-cache-control';
import error from './middleware/error';
import {determineFeaturesCohort} from './middleware/features-cohort';
import {intervalCache} from './middleware/interval-cache';

const app = new Koa();

app.use(intervalCache());
app.use(render(config.views.path));
// `error` is only after `intervalCache` and `render` as there's a dependency chain there
// TODO: remove dependency chain
app.use(error());
app.use(enforceSSL());
app.use(setCacheControl(config.cacheControl));
app.use(serve(config.static.path));
app.use(serve(config.favicon.path));
app.use(determineFeaturesCohort());
app.use(router);

export default app;
