import {
  RichTextField,
  GeoPointField,
  NumberField,
  PrismicDocument,
} from '@prismicio/types';
import { Body } from './body';
import { FetchLinks } from './types';

export type PlacePrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    geolocation: GeoPointField;
    level: NumberField;
    capacity: NumberField;
    locationInformation: RichTextField;
    body: Body;
  },
  'places'
>;
export const placesFetchLink: FetchLinks<PlacePrismicDocument> = [
  'places.title',
  'places.geolocation',
  'places.level',
  'places.capacity',
  'places.locationInformation',
];
