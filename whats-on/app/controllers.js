import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getExhibitionPromos,
  getEventPromos
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const page = Number(ctx.request.query.page);
  const paginatedExhibitions = await getExhibitionPromos(page); // TODO this should be a function that just returns temporary exhibition promos / and another one for permanent exhibitions - need to be date controlled
  const paginatedEvents = await getEventPromos(page); // TODO this should be a function that just returns events promos - need to be date controlled

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'list',
      contentType: 'event', // TODO ??
      canonicalUri: '/' // TODO ??
    }),
    paginatedExhibitions,
    paginatedEvents,
    whatsOnStuff
  });

  return next();
}
