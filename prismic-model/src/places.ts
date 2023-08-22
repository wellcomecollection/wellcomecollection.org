import title from './parts/title';
import geolocation from './parts/geolocation';
import number from './parts/number';
import body from './parts/bodies/body';
import { multiLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const places: CustomType = {
  id: 'places',
  label: 'Place',
  repeatable: true,
  status: true,
  json: {
    Place: {
      title,
      geolocation: geolocation(),
      level: number('Level'),
      capacity: number('Capacity'),
      locationInformation: multiLineText('Location information'),
      body,
    },
  },
  format: 'custom',
};

export default places;
