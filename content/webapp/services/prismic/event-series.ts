// Annoyingly this file and type is called series, but it is only used for articles
import { RelationField, PrismicDocument } from '@prismicio/types';
import { BackgroundTexturesDocument } from './background-textures';
import {
  CommonPrismicData,
  InferDataInterface,
  WithContributors,
} from './types';

export type EventSeriesPrismicDocument = PrismicDocument<
  {
    backgroundTexture: RelationField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
  } & WithContributors &
    CommonPrismicData,
  'series'
>;
