import title from './parts/title';
import description from './parts/description';
import contributors from './parts/contributors';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import body from './parts/body';

const Installations = {
  Installation: {
    title,
    description,
    start: timestamp('Start date'),
    end: timestamp('End date'),
    place,
    body
  },
  Contributors: {
    contributors
  },
  Promo: {
    promo
  }
};

export default Installations;
