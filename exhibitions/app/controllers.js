// @flow
import {model, services, Prismic, prismicParsers, List} from 'common';
const {createPageConfig, PaginationFactory} = model;
const {getPrismicApi} = services;
const {parsePromoListItem, parseExhibitionsDoc, prismicImage, asText} = prismicParsers;
import type {ExhibitionPromo} from '../model/exhibition-promo';

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

async function getTypeById(req: ?Request, types: Array<DocumentType>, id: string, qOpts: Object<any>) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByID(id, qOpts);
  return doc && types.indexOf(doc.type) !== -1 ? doc : null;
}

type ExhibitionAndRelatedContent = {|
  exhibition: Exhibition;
  galleryLevel: string;
  relatedBooks: Array<Promo>;
  relatedEvents: Array<Promo>;
  relatedGalleries: Array<Promo>;
  relatedArticles: Array<Promo>;
  imageGallery: any;
  textAndCaptionsDocument: any;
|}

async function getExhibitionAndRelatedContent(id: string, previewReq: ?Request): Promise<?ExhibitionAndRelatedContent> {
  const exhibition = await getTypeById(previewReq, ['exhibitions'], id, {});

  if (!exhibition) { return null; }

  const ex = parseExhibitionsDoc(exhibition);

  const galleryLevel = exhibition.data.galleryLevel;
  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(parsePromoListItem);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(parsePromoListItem);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(parsePromoListItem);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(parsePromoListItem);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  return {
    exhibition: ex,
    galleryLevel: galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument.url && textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  };
}

export async function renderExhibitionsList(ctx, next) {
  const page = Number(ctx.request.query.page);
  const allExhibitions = await getExhibitions(page);
  const currentPage = allExhibitions && allExhibitions.page;
  const pageSize = allExhibitions && allExhibitions.results_per_page;
  const totalResults = allExhibitions && allExhibitions.total_results_size;
  const totalPages = allExhibitions && allExhibitions.total_pages;
  const pagination = PaginationFactory.fromList(List(allExhibitions.results), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1, ctx.query);
  const moreLink = totalPages === 1 || currentPage === totalPages ? '/exhibitions/past' : null;
  const exhibitionPromos = allExhibitions.results.map((e):ExhibitionPromo => {
    return {
      id: e.id,
      url: `/exhibitions/${e.id}`,
      title: asText(e.data.title),
      image: prismicImage(e.data.promo[0].primary.image),
      description: asText(e.data.promo[0].primary.caption),
      start: e.data.start ? e.data.start : '2007-06-21T00:00:00+0000',
      end: e.data.end
    };
  });

  const permanentExhibitionPromos = exhibitionPromos.filter((e) => {
    return !e.end;
  });
  const temporaryExhibitionPromos = exhibitionPromos.filter((e) => {
    return e.end;
  });

  ctx.render('pages/exhibitions', {
    pageConfig: createPageConfig({
      path: ctx.request.url,
      title: 'Exhibitions',
      inSection: 'whatson',
      category: 'publicprograms',
      contentType: 'listing',
      canonicalUri: '/exhibitions'
    }),
    allExhibitions: permanentExhibitionPromos.concat(temporaryExhibitionPromos),
    moreLink,
    pagination
  });

  return next();
}

async function getExhibitions(page = 1, pageSize = 40): Promise {
  const prismic = await getPrismicApi();
  const exhibitionsList = await prismic.query([
    Prismic.Predicates.any('document.type', ['exhibitions'])
  ], { orderings: '[my.exhibitions.start desc]', page, pageSize });
  return exhibitionsList;
}
