// @flow
import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import structuredText from './parts/structured-text';

const Installations = {
  Installation: {
    title,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    place,
    body
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single')
  }
};

export default Installations;
