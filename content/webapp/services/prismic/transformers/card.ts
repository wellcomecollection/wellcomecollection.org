import { CardPrismicDocument } from '../types/card';
import {
  parseTitle,
  parseFormat,
  asText,
} from '@weco/common/services/prismic/parsers';
import { transformImage } from './images';
import { Card } from '@weco/common/model/card';
import { transformLink } from '.';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, format, description, image, link } = document.data;

  return {
    type: 'card',
    title: parseTitle(title),
    format: parseFormat(format),
    description: asText(description),
    image: transformImage(image),
    link: transformLink(link),
  };
}
