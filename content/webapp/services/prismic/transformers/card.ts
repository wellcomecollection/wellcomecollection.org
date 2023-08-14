import { CardPrismicDocument } from '../types/card';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { Card } from '../../../types/card';
import { asText, asTitle, transformFormat } from '.';
import { transformLink } from '@weco/common/services/prismic/transformers';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, description, image, link } = document.data;

  return {
    type: 'card',
    id: document.id,
    title: asTitle(title),
    format: transformFormat(document),
    description: asText(description),
    image: transformImage(image),
    link: transformLink(link),
  };
}
