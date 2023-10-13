import * as prismic from '@prismicio/client';
import { CommonPrismicFields, WithContributors } from '.';
import { ExhibitionPrismicDocument } from './exhibitions';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type VisualStoryDocument = prismic.PrismicDocument<
  {
    datePublished: prismic.TimestampField;
    showOnThisPage: boolean;
    'related-document': prismic.ContentRelationshipField<
      'exhibitions',
      'en-gb',
      InferDataInterface<ExhibitionPrismicDocument>
    >;
  } & CommonPrismicFields &
    WithContributors,
  'visual-stories'
>;
