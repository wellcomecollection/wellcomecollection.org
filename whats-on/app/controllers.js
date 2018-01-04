import {model, prismic} from 'common';
import {galleryOpeningHours} from '../../server/model/opening-hours';

import {
  bookshopPromo,
  cafePromo,
  libraryPromo,
  readingRoomPromo,
  restaurantPromo,
  spiritBoothPromo
} from '../../server/data/daily-promos';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const { 'f[dates]': timeSpan } = ctx.query;
  const todayString = new Date().toLocaleString('en-us', { weekday: 'long' });
  const todayOpeningHours = galleryOpeningHours.find(i => i.dayOfWeek === todayString);
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
    todayOpeningHours,
    exhibitionAndEventPromos,
    whileVisitPromos: [libraryPromo, readingRoomPromo, spiritBoothPromo],
    eatShopPromos: [cafePromo, restaurantPromo, bookshopPromo]
  });

  return next();
}
