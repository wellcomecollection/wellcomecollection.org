// @flow
import list from '../parts/list';
import link from '../parts/link';

const LocatedThing = {
  Location: {
    locations: list('Locations', {
      place: link('Location', 'document', ['place']),
    }),
  },
};

export default LocatedThing;
