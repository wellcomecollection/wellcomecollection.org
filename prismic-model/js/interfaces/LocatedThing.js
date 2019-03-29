// @flow
import list from '../parts/list';
import link from '../parts/link';

function LocatedThing() {
  return {
    Location: {
      locations: list('Locations', {
        place: link('Location', 'document', ['place']),
      }),
    },
  };
}

export default LocatedThing;
