import structuredText from './parts/structured-text';
import image from './parts/image';
import link from './parts/link';

const ManualPromo = {
  Contact: {
    title: structuredText('Title', 'single', ['heading1']),
    format: link('Format', 'document', ['article-formats', 'event-formats']),
    summary: structuredText('Summary', 'single'),
    image: image('Image'),
    url: link('Promo link'),
  },
};

export default ManualPromo;
