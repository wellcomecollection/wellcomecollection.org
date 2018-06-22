// @flow
import title from './parts/title';
import geolocation from './parts/geolocation';
import number from './parts/number';
import body from './parts/body';
import structureText from './parts/structured-text';

const Place = {
  Place: {
    title,
    geolocation: geolocation(),
    level: number('Level'),
    capacity: number('Capacity'),
    locationInformation: structureText('Location information'),
    body
  }
};

export default Place;
