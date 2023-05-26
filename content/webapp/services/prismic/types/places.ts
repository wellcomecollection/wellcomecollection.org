import * as prismic from '@prismicio/client';
import { Body } from './body';
import { CommonPrismicFields, FetchLinks } from '.';

export type PlacePrismicDocument = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    geolocation: prismic.GeoPointField;
    level: prismic.NumberField;
    capacity: prismic.NumberField;
    locationInformation: prismic.RichTextField;
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
