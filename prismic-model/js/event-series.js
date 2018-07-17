// @flow
import title from './parts/title';
import promo from './parts/promo';
import description from './parts/description';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import link from './parts/link';

const EventSeries = {
  EventSeries: {
    title,
    description,
    backgroundTexture: link('Background texture', 'document', ['background-textures'])
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  },
  Dev: {
    body
  }
};

export default EventSeries;
