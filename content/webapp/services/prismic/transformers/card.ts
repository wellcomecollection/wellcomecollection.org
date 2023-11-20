import { CardPrismicDocument } from '../types/card';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { Card } from '@weco/content/types/card';
import { asText, asTitle, transformFormat } from '.';
import { transformLink } from '@weco/common/services/prismic/transformers';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';

export function transformCard(document: CardPrismicDocument): Card {
  const { title, description, image, link } = document.data;

  return {
    type: 'card',
    id: isFilledLinkToDocument(link) ? link.id : undefined,
    title: asTitle(title),
    format: transformFormat(document),
    description: asText(description),
    image: transformImage(image),
    link: transformLink(link),
  };
}
