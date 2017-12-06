// @flow
import {model, prismic} from 'common';
const {createPageConfig} = model;
const {
  getExhibitionAndRelatedContent,
  getPaginatedResults
} = prismic;

export async function renderExhibition(ctx, next) {
  const id = `${ctx.params.id}`;
  const isPreview = Boolean(ctx.params.preview);
  const exhibitionContent = await getExhibitionAndRelatedContent(id, isPreview ? ctx.request : null);
  const format = ctx.request.query.format;
  const path = ctx.request.url;
  const tags = [{
    text: 'Exhibitions',
    url: '/whats-on/exhibitions/all-exhibitions'
  }];

  if (exhibitionContent) {
    if (format === 'json') {
      ctx.body = exhibitionContent;
    } else {
      ctx.render('pages/exhibition', {
        pageConfig: createPageConfig({
          path: path,
          title: exhibitionContent.exhibition.title,
          inSection: 'whatson',
          category: 'publicprograms',
          contentType: 'exhibitions',
          canonicalUri: `${ctx.globals.rootDomain}/exhibitions/${exhibitionContent.exhibition.id}`
        }),
        exhibitionContent: exhibitionContent,
        isPreview: isPreview,
        tags
      });
    }
  }

  return next();
}

export async function renderExhibitionsList(ctx, next) {
  const page = Number(ctx.request.query.page);
  const exhibitionsList = await getPaginatedResults(page, 'exhibition');

  ctx.render('pages/exhibitions', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Exhibitions',
      inSection: 'whatson',
      category: 'publicprograms',
      contentType: 'listing',
      canonicalUri: '/exhibitions'
    }),
    exhibitionsList
  });

  return next();
}
