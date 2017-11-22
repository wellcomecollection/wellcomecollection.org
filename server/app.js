import Koa from 'koa';
import config from './config';
import serve from 'koa-static';
import path from 'path';
import {router as defaultRouter} from './routes';
import render from './view/render';
import setCacheControl from './middleware/set-cache-control';
import {serverError, notFound} from './middleware/error';
import {determineFeaturesCohort} from './middleware/features-cohort';
import {intervalCache} from './middleware/interval-cache';
import {setFeaturesCohortFromCtx} from './middleware/set-features-cohort-from-ctx';

function p(p: string) {
  return path.join(__dirname, p);
}

export function setupApp({ router, viewPaths = [] }) {
  const app = new Koa();
  const globals = config.globals[app.env];
  app.proxy = true;
  app.use((ctx, next) => {
    ctx.globals = globals;
    return next();
  });
  app.use(intervalCache());
  app.use(determineFeaturesCohort());
  app.use(setFeaturesCohortFromCtx());
  app.use(render([config.views.path].concat(viewPaths), globals));
  // `error` is only after `intervalCache` and `render` as there's a dependency chain there
  // TODO: remove dependency chain
  app.use(serverError(globals.beaconErrors));
  app.use(notFound());
  app.use(setCacheControl(config.cacheControl));
  app.use(serve(p(config.static.path)));
  app.use(serve(p(config.favicon.path)));
  app.use(defaultRouter);
  app.use(router);

  return app;
}
