// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import structuredText from './parts/structured-text';

const Project = {
  Project: {
    title,
    body,
  },
  Promo: {
    promo,
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
};

export default Project;
