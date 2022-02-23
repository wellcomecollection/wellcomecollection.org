import { CardPrismicDocument } from '../types/card';
import {
  parseTitle,
  parseFormat,
  asText,
  parseLink,
} from '@weco/common/services/prismic/parsers';
import { transformImage } from './images';
import { Card } from '@weco/common/model/card';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, format, description, image, link } = document.data;

  return {
    type: 'card',
    title: parseTitle(title),
    format: parseFormat(format),
    description: asText(description),
    image: transformImage(image),
    link: parseLink(link),
  };
}
