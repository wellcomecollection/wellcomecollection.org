import {
  RichTextField,
  GeoPointField,
  NumberField,
  PrismicDocument,
} from '@prismicio/types';
import { Body } from './body';

export type PlacePrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    geolocation: GeoPointField;
    level: NumberField;
    capacity: NumberField;
    locatiolocationInformation: RichTextField;
    body: Body;
  },
  'places'
>;
