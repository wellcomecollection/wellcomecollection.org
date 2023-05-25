import { singleLineText } from './parts/text';
import title from './parts/title';
import image from './parts/image';
import link, { documentLink } from './parts/link';
import { CustomType } from './types/CustomType';

const card: CustomType = {
  id: 'card',
  label: 'Card',
  repeatable: true,
  status: true,
  json: {
    Card: {
      title,
      format: documentLink('Format', {
        linkedTypes: ['event-formats', 'article-formats', 'labels'],
      }),
      description: singleLineText('Description'),
      image: image('Image'),
      link: link('Link'),
    },
  },
  format: 'custom',
};

export default card;
