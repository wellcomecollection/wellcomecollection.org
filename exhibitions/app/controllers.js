
// @flow
import {List} from 'immutable';
import {createPageConfig} from 'common/model/page-config';
import getBreakpoint from 'common/filters/get-breakpoint';
import {getPrismicApi} from 'common/services/prismic';
import {parseBody} from 'common/services/prismic-body-parser';
import {
  asText,
  asHtml,
  parsePicture,
  parseImagePromo,
  parsePromoListItem
} from 'common/services/prismic-parsers';

async function getTypeById(req: ?Request, types: Array<DocumentType>, id: string, qOpts: Object<any>) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByID(id, qOpts);
  return doc && types.indexOf(doc.type) !== -1 ? doc : null;
}

export async function renderExhibition(ctx, next) {
  const id = `${ctx.params.id}`;
  const isPreview = Boolean(ctx.params.preview);
  const exhibitionContent = await getExhibition(id, isPreview ? ctx.request : null);
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
      ctx.render('exhibition', {
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

export async function getExhibition(id: string, previewReq: ?Request): Promise<?ExhibitionContent> {
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

export function parseExhibitionsDoc(doc: PrismicDoc): Exhibition {
  const featuredImageMobileCrop = parsePicture({image: doc.data.featuredImageMobileCrop});
  const featuredImageMobileCropWithBreakpoint = featuredImageMobileCrop.contentUrl && Object.assign({}, featuredImageMobileCrop, {minWidth: getBreakpoint('small')});
  const promo = parseImagePromo(doc.data.promo);

  const featuredImage = doc.data.featuredImage && parsePicture({ image: doc.data.featuredImage });
  const thinVideoImage = featuredImage && parsePicture({image: doc.data.featuredImage['32:15']}, getBreakpoint('medium'));
  const squareImage = featuredImage && parsePicture({image: doc.data.featuredImage.square}, getBreakpoint('small'));
  const featuredImages = List([
    thinVideoImage,
    // we use the "creative" crop first, but it seems that people would rather have it automatically.
    featuredImageMobileCropWithBreakpoint || squareImage
  ]).filter(_ => _);

  const exhibition = ({
    id: doc.id,
    title: asText(doc.data.title),
    subtitle: asText(doc.data.subtitle),
    start: doc.data.start,
    end: doc.data.end,
    featuredImages: featuredImages,
    featuredImage: featuredImages.first(),
    intro: asText(doc.data.intro),
    description: asHtml(doc.data.description),
    promo: promo,
    body: parseBody(doc.data.body)
  }: Exhibition);

  return exhibition;
}
