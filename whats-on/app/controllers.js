import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const { 'f[dates]': timeSpan } = ctx.query;
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos(timeSpan);

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'list',
      contentType: 'public-programme',
      canonicalUri: '/whats-on'
    }),
    exhibitionAndEventPromos
  });

  return next();
}
