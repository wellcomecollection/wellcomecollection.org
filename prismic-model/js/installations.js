import title from './parts/title';
import description from './parts/description';
import contributors from './parts/contributors';
import promo from './parts/promo';
import place from './parts/place';

const Installations = {
  Installation: {
    title,
    description,
    place
  },
  Contributors: {
    contributors
  },
  Promo: {
    promo
  }
};

export default Installations;
