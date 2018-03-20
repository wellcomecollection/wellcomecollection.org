import title from './parts/title';
import description from './parts/description';
import contributors from './parts/contributors';
import promo from './parts/promo';
import timestamp from './parts/timestamp';

const Installations = {
  Installation: {
    title,
    description,
    start: timestamp('Start date'),
    end: timestamp('End date')
  },
  Contributors: {
    contributors
  },
  Promo: {
    promo
  }
};

export default Installations;
