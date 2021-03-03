// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';

const Guide = {
  Guide: {
    title,
    format: link('Format', 'document', ['guide-formats']),
    datePublished: timestamp('Date published'),
    body,
  },
  Promo: {
    promo,
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
};

export default Guide;
