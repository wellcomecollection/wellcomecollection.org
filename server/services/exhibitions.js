// @flow
import type {Exhibition} from '../content-model/exhibition';
import type {IApi} from 'prismic-javascript';
import {prismicImageToPicture} from '../services/prismic-content';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import type {Promo} from '../model/promo';
import {parseExhibitionsDoc} from './prismic-parsers';

type ExhibitionContent = {|
    exhibition: Exhibition;
    galleryLevel: string;
    relatedBooks: Array<Promo>;
    relatedEvents: Array<Promo>;
    relatedGalleries: Array<Promo>;
    relatedArticles: Array<Promo>;
    imageGallery: any;
    textAndCaptionsDocument: any;
|}

function exhibitionPromoToPromo(item) {
  return ({
    contentType: item.type,
    url: item.link.url,
    title: item.title[0].text,
    description: item.description[0].text,
    image: prismicImageToPicture(item)
  } : Promo);
}

export async function getExhibition(id: string, previewReq: ?Request): Promise<?ExhibitionContent> {
  const prismic: IApi = previewReq ? await prismicPreviewApi(previewReq) : await prismicApi();
  const fetchLinks = [];
  const exhibition = await prismic.getByID(id, {fetchLinks});

  if (!exhibition) return;

  const ex = parseExhibitionsDoc(exhibition);

  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(exhibitionPromoToPromo);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(exhibitionPromoToPromo);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(exhibitionPromoToPromo);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(exhibitionPromoToPromo);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  return {
    exhibition: ex,
    galleryLevel: '0',
    textAndCaptionsDocument: textAndCaptionsDocument.url && textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  };
}
