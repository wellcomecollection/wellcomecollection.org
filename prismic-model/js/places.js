// @flow
import title from './parts/title';
import geolocation from './parts/geolocation';
import number from './parts/number';
import body from './parts/body';

const Place = {
  Place: {
    title,
    geolocation: geolocation(),
    level: number('Level'),
    capacity: number('Capacity'),
    body
  }
};

export default Place;
