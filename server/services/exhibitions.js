// @flow
import type {Exhibition} from '../content-model/content-blocks';
import type {IApi} from 'prismic-javascript';
import {prismicImageToPicture, convertContentToBodyParts} from '../services/prismic-content';
import {RichText} from 'prismic-dom';
import {prismicApi, prismicPreviewApi} from './prismic-api';

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
  const bodyParts = convertContentToBodyParts(exhibition.data.body);
  const video = bodyParts.find(p => p.type === 'video-embed');
  const text = bodyParts.find(p => p.type === 'text');
  const imageGallery = bodyParts.find(p => p.type === 'imageGallery');

  return ({
    blockType: 'exhibitions',
    id: exhibition.id,
    title: RichText.asText(exhibition.data.title),
    start: exhibition.data.start,
    end: exhibition.data.end,
    featuredImage: featuredImage,
    featuredImageMobileCrop: featuredImageMobileCrop,
    accessStatements: exhibition.data.accessStatements,
    description: exhibition.data.description && RichText.asHtml(exhibition.data.description),
    video: video,
    text: text,
    imageGallery: imageGallery
  }: Exhibition);
}
