import { CardPrismicDocument } from '../types/card';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { Card } from '../../../types/card';
import { asText, asTitle, transformFormat, transformLink } from '.';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, description, image, link } = document.data;

  return {
    type: 'card',
    title: asTitle(title),
    format: transformFormat(document),
    description: asText(description),
    image: transformImage(image),
    link: transformLink(link),
  };
}
