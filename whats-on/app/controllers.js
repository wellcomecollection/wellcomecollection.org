import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const page = Number(ctx.request.query.page);
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos(page);

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'list',
      contentType: 'event', // TODO ??
      canonicalUri: '/' // TODO ??
    }),
    exhibitionAndEventPromos
  });

  return next();
}
