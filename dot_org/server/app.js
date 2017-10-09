import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import {router} from './routes';
import render from './view/render';
import setCacheControl from './middleware/set-cache-control';
import {serverError, notFound} from './middleware/error';
import {determineFeaturesCohort} from './middleware/features-cohort';
import {intervalCache} from './middleware/interval-cache';

const app = new Koa();
const globals = config.globals[app.env];
app.proxy = true;
app.use((ctx, next) => {
  ctx.globals = globals;
  return next();
});
app.use(intervalCache());
app.use(determineFeaturesCohort());
app.use(render(config.views.path, globals));
// `error` is only after `intervalCache` and `render` as there's a dependency chain there
// TODO: remove dependency chain
app.use(serverError(globals.beaconError));
app.use(notFound());
app.use(setCacheControl(config.cacheControl));
app.use(serve(config.static.path));
app.use(serve(config.favicon.path));
app.use(router);

export default app;
