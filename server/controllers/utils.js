import {createPageConfig} from '../model/page-config';

export const healthcheck = (ctx, next) => {
  ctx.body = 'ok';
  return next();
};

export const featureFlags = (ctx, next) => {
  ctx.render('pages/flags', {
    pageConfig: createPageConfig({inSection: 'index'})
  });
  return next();
};

export const getQueryString = function(query) {
  return Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');
};
