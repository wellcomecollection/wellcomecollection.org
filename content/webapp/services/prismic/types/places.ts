import {
  RichTextField,
  GeoPointField,
  NumberField,
  PrismicDocument,
} from '@prismicio/client';
import { Body } from './body';
import { CommonPrismicFields, FetchLinks } from '.';

export type PlacePrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    geolocation: GeoPointField;
    level: NumberField;
    capacity: NumberField;
    locationInformation: RichTextField;
    body: Body;
  } & CommonPrismicFields,
  'places'
>;

export const placesFetchLinks: FetchLinks<PlacePrismicDocument> = [
  'places.title',
  'places.geolocation',
  'places.level',
  'places.capacity',
  'places.locationInformation',
];
