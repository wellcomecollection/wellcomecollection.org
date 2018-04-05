import {model, prismic} from 'common';
const {createPageConfig} = model;
const {getPaginatedExhibitionPromos} = prismic;

export async function renderExhibitionsList(ctx, next) {
  const page = Number(ctx.request.query.page);
  const paginatedExhibitions = await getPaginatedExhibitionPromos(page);

  ctx.render('pages/exhibitions', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Exhibitions',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'listing',
      canonicalUri: '/exhibitions'
    }),
    paginatedExhibitions
  });

  return next();
}
