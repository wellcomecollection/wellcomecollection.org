// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import structuredText from './parts/structured-text';
import contributorsWithTitle from './parts/contributorsWithTitle';

const Project = {
  Project: {
    title,
    body,
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo,
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
};

export default Project;
