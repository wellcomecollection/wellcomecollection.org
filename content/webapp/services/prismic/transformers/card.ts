import { CardPrismicDocument } from '../types/card';
import {
  parseTitle,
  parseFormat,
  asText,
  checkAndParseImage,
  parseLink,
} from '@weco/common/services/prismic/parsers';
import { Card } from '@weco/common/model/card';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, format, description, image, link } = document.data;

  return {
    type: 'card',
    title: parseTitle(title),
    format: parseFormat(format),
    description: asText(description),
    image: image ? checkAndParseImage(image) : null,
    link: parseLink(link),
    order: undefined,
  };
}
