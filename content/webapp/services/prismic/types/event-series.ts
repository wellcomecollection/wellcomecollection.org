import { RelationField, PrismicDocument } from '@prismicio/types';
import { BackgroundTexturesDocument } from './background-textures';
import { CommonPrismicFields, WithContributors } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

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
