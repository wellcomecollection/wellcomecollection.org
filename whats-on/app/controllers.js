import {model} from 'common';
const {createPageConfig} = model;

export async function renderWhatsOn(ctx, next) {
  const whatsOnStuff = 'all the stuff';

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'list',
      contentType: 'event', // TODO ??
      canonicalUri: '/' // TODO ??
    }),
    whatsOnStuff
  });

  return next();
}
