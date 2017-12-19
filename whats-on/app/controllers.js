import {model, prismic} from 'common';
import {readingRoomPromo, cafePromo, libraryPromo, restaurantPromo, bookshopPromo} from '../../server/data/daily-promos';
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
    exhibitionAndEventPromos,
    readingRoomPromo,
    cafePromo,
    libraryPromo,
    restaurantPromo,
    bookshopPromo
  });

  return next();
}
