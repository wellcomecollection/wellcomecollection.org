import { CardDocument as RawCardDocument } from '@weco/common/prismicio-types';
import { transformLink } from '@weco/common/services/prismic/transformers';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';
import { Card } from '@weco/content/types/card';

import { asText, asTitle, transformFormat } from '.';

export function transformCard(document: RawCardDocument): Card {
  const { title, description, image, link } = document.data;

  return {
    type: 'card',
    id:
      link.link_type === 'Document' && isFilledLinkToDocument(link)
        ? link.id
        : undefined,
    title: asTitle(title),
    format: transformFormat(document as never),
    description: asText(description),
    image: transformImage(image),
    link: transformLink(link),
  };
}
