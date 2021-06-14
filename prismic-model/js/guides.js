// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import link from './parts/link';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';
import boolean from './parts/boolean';

const Guide = {
  Guide: {
    title,
    format: link('Format', 'document', ['guide-formats']),
    datePublished: timestamp('Date published'),
    showOnThisPage: boolean("Show 'On this page' anchor links (even when true, this will only appear if there are more than 2 H2s in the body)", false),
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
