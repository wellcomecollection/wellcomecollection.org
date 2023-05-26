import * as prismic from '@prismicio/client';
import { BackgroundTexturesDocument } from './background-textures';
import { CommonPrismicFields, WithContributors } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type EventSeriesPrismicDocument = prismic.PrismicDocument<
  {
    backgroundTexture: prismic.ContentRelationshipField<
      'background-textures',
      'en-gb',
      InferDataInterface<BackgroundTexturesDocument>
    >;
  } & WithContributors &
    CommonPrismicFields,
  'event-series'
>;
