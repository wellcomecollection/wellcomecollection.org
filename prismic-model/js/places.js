// @flow
import createThing from './interfaces/Thing';
import LocatedThing from './interfaces/LocatedThing';
import description from './parts/description';
import structuredText from './parts/structured-text';
import number from './parts/number';
import geolocation from './parts/geolocation';

const Place = createThing(
  'places',
  {
    description: description,
    geolocation: geolocation(),
    level: number('Level'),
    capacity: number('Capacity'),
    locationInformation: structuredText('Location information'),
  },
  [LocatedThing]
);

export default Place;
