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
    body,
    instructions: structureText('Instructions')
  }
};

export default Place;
