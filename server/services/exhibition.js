// @flow
import type {Exhibition} from '../content-model/content-blocks';
import type {IApi} from 'prismic-javascript';
import {prismicImageToPicture} from '../services/prismic-content';
import {RichText} from 'prismic-dom';
import {prismicApi} from './prismic-api';

export async function getExhibition(id: string): Promise<?Exhibition> {
  const prismic: IApi = await prismicApi();
  const fetchLinks = [
    'access-statements.title',
    'access-statements.description'
  ];
  const exhibition = await prismic.getByID(id, {fetchLinks});

  if (!exhibition) return;

  const featuredImage = prismicImageToPicture({image: exhibition.data.featuredImage});

  return ({
    blockType: 'exhibition',
    id: exhibition.id,
    title: RichText.asText(exhibition.data.title),
    start: exhibition.data.start,
    end: exhibition.data.end,
    featuredImage: featuredImage,
    accessStatements: exhibition.data.accessStatements
  }: Exhibition);
}
