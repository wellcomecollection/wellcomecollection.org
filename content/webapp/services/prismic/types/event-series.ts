// Annoyingly this file and type is called series, but it is only used for articles
import { RelationField, PrismicDocument } from '@prismicio/types';
import { BackgroundTexturesDocument } from './background-textures';
import {
  CommonPrismicFields,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  InferDataInterface,
  WithContributors,
} from '.';

export type EventSeriesPrismicDocument = PrismicDocument<
  {
    backgroundTexture: RelationField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
  } & WithContributors &
    CommonPrismicFields,
  'event-series'
>;

export const eventSeriesFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
];
