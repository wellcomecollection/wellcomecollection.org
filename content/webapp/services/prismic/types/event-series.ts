import { ContentRelationshipField, PrismicDocument } from '@prismicio/client';
import { BackgroundTexturesDocument } from './background-textures';
import { CommonPrismicFields, WithContributors } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type EventSeriesPrismicDocument = PrismicDocument<
  {
    backgroundTexture: ContentRelationshipField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
  } & WithContributors &
    CommonPrismicFields,
  'event-series'
>;
