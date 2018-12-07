// @flow
import title from './parts/title';
import promo from './parts/promo';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import link from './parts/link';
import structuredText from './parts/structured-text';

const EventSeries = {
  'Event series': {
    title,
    backgroundTexture: link('Background texture', 'document', ['background-textures']),
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

export default EventSeries;
