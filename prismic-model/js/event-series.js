// @flow
import title from './parts/title';
import promo from './parts/promo';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import link from './parts/link';

const EventSeries = {
  EventSeries: {
    title,
    backgroundTexture: link('Background texture', 'document', ['background-textures']),
    body
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  }
};

export default EventSeries;
