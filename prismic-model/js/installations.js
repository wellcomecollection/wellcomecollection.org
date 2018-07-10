// @flow
import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';

const Installations = {
  Installation: {
    title,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    place,
    body
  },
  Contributors: contributorsWithTitle,
  Promo: {
    promo
  }
};

export default Installations;
