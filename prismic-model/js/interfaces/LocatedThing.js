// @flow
import createThing from './Thing';
import list from '../parts/list';
import link from '../parts/link';

function createLocatedThing(type: string, data: Object) {
  const model = createThing(type, {
    places: list('Places', {
      place: link('Place', 'document', ['place']),
    }),
    ...data,
  });

  return model;
}

export default createLocatedThing;
