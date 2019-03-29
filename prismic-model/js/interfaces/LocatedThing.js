// @flow
import list from '../parts/list';
import link from '../parts/link';

const LocatedThing = {
  Location: {
    places: list('Places', {
      place: link('Place', 'document', ['place']),
    }),
  },
};

export default LocatedThing;
