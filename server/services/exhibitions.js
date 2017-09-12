// @flow
import type {Exhibition} from '../content-model/content-blocks';
import type {IApi} from 'prismic-javascript';
import {prismicImageToPicture, convertContentToBodyParts} from '../services/prismic-content';
import {RichText} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import getBreakpoint from '../filters/get-breakpoint';

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
    galleryLevel: exhibition.data.gallery_level
  }: Exhibition);
}
