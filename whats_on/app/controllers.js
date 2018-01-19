import {model, prismic} from 'common';

import {
  bookshopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo,
  spiritBoothPromo
} from '../../server/data/facility-promos';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos(ctx.query);

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'list',
      canonicalUri: '/whats-on'
    }),
    exhibitionAndEventPromos,
    whileVisitPromos: [readingRoomPromo, spiritBoothPromo],
    eatShopPromos: [cafePromo, restaurantPromo, bookshopPromo]
  });

  return next();
}
