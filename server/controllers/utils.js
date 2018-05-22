import {createPageConfig} from '../model/page-config';

export const healthcheck = (ctx, next) => {
  ctx.body = 'ok';
  return next();
};

export const featureFlags = (ctx, next) => {
  const path = ctx.request.url;

  ctx.render('pages/flags', {
    pageConfig: createPageConfig({inSection: 'index', path: path})
  });
  return next();
};

export const progress = (ctx, next) => ctx.render('pages/progress', {
  pageConfig: createPageConfig({inSection: 'index', path: '/progress'})
}) && next();
