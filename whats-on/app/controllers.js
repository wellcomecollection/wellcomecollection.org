import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos,
  getTodaysExhibitionAndEventPromos,
  getWeekendsExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos();

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
