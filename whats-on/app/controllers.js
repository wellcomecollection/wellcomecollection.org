import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getPaginatedResults
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const page = Number(ctx.request.query.page);
  const paginatedExhibitions = await getPaginatedResults(page, 'exhibition'); // TODO this should be a function that just returns temporary exhibition promos / and another one for permanent exhibitions
  const paginatedEvents = await getPaginatedResults(page, 'event') ; // TODO this should be a function that just returns events promos
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
    paginatedExhibitions,
    paginatedEvents,
    whatsOnStuff
  });

  return next();
}
