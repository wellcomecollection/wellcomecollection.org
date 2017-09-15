// @flow
import type {Exhibition} from '../content-model/content-blocks';
import type {IApi} from 'prismic-javascript';
import {prismicImageToPicture, convertContentToBodyParts} from '../services/prismic-content';
import {RichText} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import getBreakpoint from '../filters/get-breakpoint';
import type {Promo} from '../model/promo';

function exhibitionPromoToPromo(item) {
  return ({
    contentType: item.type,
    url: item.link.url,
    title: item.title[0].text,
    description: item.description[0].text,
    image: prismicImageToPicture(item)
  } : Promo);
};

export async function getExhibition(id: string, previewReq: ?Request): Promise<?Exhibition> {
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
  const video = bodyParts.find(p => p.type === 'video-embed');
  const text = bodyParts.find(p => p.type === 'text');
  const standfirst = bodyParts.find(p => p.type === 'standfirst');
  const imageGallery = bodyParts.find(p => p.type === 'imageGallery');

  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(exhibitionPromoToPromo);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(exhibitionPromoToPromo);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(exhibitionPromoToPromo);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(exhibitionPromoToPromo);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  return ({
    blockType: 'exhibitions',
    id: exhibition.id,
    title: RichText.asText(exhibition.data.title),
    start: exhibition.data.start,
    end: exhibition.data.end,
    featuredImages: featuredImages,
    accessStatements: exhibition.data.accessStatements,
    description: exhibition.data.description && RichText.asHtml(exhibition.data.description),
    video: video,
    standfirst: standfirst,
    text: text,
    imageGallery: imageGallery,
    galleryLevel: exhibition.data.gallery_level,
    textAndCaptionsDocument: textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  }: Exhibition);
}
