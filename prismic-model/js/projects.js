// @flow
import title from './parts/title';
import body from './parts/body';
import promo from './parts/promo';
import structuredText from './parts/structured-text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import link from './parts/link';
import list from './parts/list';
import timestamp from './parts/timestamp';

const Project = {
  Project: {
    title,
    format: link('Format', 'document', ['project-formats']),
    start: timestamp('Start date'),
    end: timestamp('End date'),
    body,
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo,
  },
  'Content relationships': {
    seasons: list('Seasons', {
      season: link('Season', 'document', ['seasons'], 'Select a Season'),
    }),
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
};

export default Project;
