// @flow
import createLocatedThing from './interfaces/LocatedThing';
import text from './parts/text';
import description from './parts/description';
import list from './parts/list';
import structuredText from './parts/structured-text';
import number from './parts/number';
import geolocation from './parts/geolocation';

const Place = createLocatedThing('places', {
  description: description,
  geolocation: geolocation(),
  level: number('Level'),
  capacity: number('Capacity'),
  locationInformation: structuredText('Location information'),
  sameAs: list('Same as', {
    link: text('Link'),
    title: structuredText('Link text', 'single'),
  }),
});

export default Place;
