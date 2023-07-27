import * as prismic from '@prismicio/client';
import { CommonPrismicFields, WithContributors } from '.';

export type VisualStoryDocument = prismic.PrismicDocument<
  {
    datePublished: prismic.TimestampField;
    showOnThisPage: boolean;
  } & CommonPrismicFields &
    WithContributors,
  'visual-stories'
>;
