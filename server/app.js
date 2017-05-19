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

app.use(enforceSSL());
app.use(setCacheControl(config.cacheControl));
app.use(intervalCache());
app.use(serve(config.static.path));
app.use(serve(config.favicon.path));
app.use(render(config.views.path));
app.use(determineFeaturesCohort());
app.use(router);
app.use(error());

export default app;
