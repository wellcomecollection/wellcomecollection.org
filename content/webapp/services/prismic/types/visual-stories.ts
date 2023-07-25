import * as prismic from '@prismicio/client';
import { CommonPrismicFields } from '.';

export type VisualStoriesDocument = prismic.PrismicDocument<
  {
    datePublished: prismic.TimestampField;
    showOnThisPage: boolean;
  } & CommonPrismicFields,
  'visual-stories'
>;
