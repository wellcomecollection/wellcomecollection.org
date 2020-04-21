import structuredText from './parts/structured-text';
import title from './parts/title';
import image from './parts/image';
import link from './parts/link';

const Cards = {
  Card: {
    title,
    format: link('Format', 'document', ['event-formats', 'article-formats']),
    description: structuredText('Description', 'single'),
    image: image('Image'),
    link: link('Link'),
  },
};

export default Cards;
