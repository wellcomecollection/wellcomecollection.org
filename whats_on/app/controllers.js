import {model, prismic} from 'common';

import {
  bookshopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo
} from '../../server/data/facility-promos';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const exhibitionAndEventPromos = await getExhibitionAndEventPromos(ctx.query);
  // TODO: This isn't the tidiest implementation, but I've tried to keep it
  // close to the edge as I'm not sold we know what to do with "Installations" yet.
  const whileVisitPromos = [readingRoomPromo]
    .concat(exhibitionAndEventPromos.installationPromos)
    .map(promo => Object.assign({}, {
      metaIcon: 'clock',
      metaText: 'Open during gallery hours'
    }, promo));

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
    whileVisitPromos,
    eatShopPromos: [cafePromo, restaurantPromo, bookshopPromo]
  });

  return next();
}
