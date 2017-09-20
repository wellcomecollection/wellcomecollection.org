// @flow
import type {Exhibition} from '../content-model/exhibition';
import type {IApi} from 'prismic-javascript';
import {List} from 'immutable';
import {prismicImageToPicture, convertContentToBodyParts, getPromo, asHtml, asText} from '../services/prismic-content';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import getBreakpoint from '../filters/get-breakpoint';
import type {Promo} from '../model/promo';

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
};

export async function getExhibition(id: string, previewReq: ?Request): Promise<?ExhibitionContent> {
  const prismic: IApi = previewReq ? await prismicPreviewApi(previewReq) : await prismicApi();
  const fetchLinks = [
    'access-statements.title',
    'access-statements.description'
  ];
  const exhibition = await prismic.getByID(id, {fetchLinks});

  if (!exhibition) return;

  const featuredImage = prismicImageToPicture({image: exhibition.data.featuredImage});
  const featuredImageMobileCrop = prismicImageToPicture({image: exhibition.data.featuredImageMobileCrop});
  const featuredImageWithBreakpoint = featuredImage.contentUrl && Object.assign({}, featuredImage, {minWidth: getBreakpoint('medium')});
  const featuredImageMobileCropWithBreakpoint = featuredImageMobileCrop.contentUrl && Object.assign({}, featuredImageMobileCrop, {minWidth: getBreakpoint('small')});
  const featuredImages = [featuredImageWithBreakpoint, featuredImageMobileCropWithBreakpoint].filter(_ => _);

  const bodyParts = convertContentToBodyParts(exhibition.data.body);
  const imageGallery = bodyParts.find(p => p.type === 'imageGallery');

  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(exhibitionPromoToPromo);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(exhibitionPromoToPromo);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(exhibitionPromoToPromo);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(exhibitionPromoToPromo);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  const promo = getPromo(exhibition);

  const ex = ({
    id: exhibition.id,
    title: asText(exhibition.data.title),
    subtitle: asText(exhibition.data.subtitle),
    start: exhibition.data.start,
    end: exhibition.data.end,
    featuredImages: List(featuredImages),
    description: asHtml(exhibition.data.description),
    promo: promo
  }: Exhibition);

  return {
    exhibition: ex,
    imageGallery: imageGallery,
    galleryLevel: '0',
    textAndCaptionsDocument: textAndCaptionsDocument.url && textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  };
}
