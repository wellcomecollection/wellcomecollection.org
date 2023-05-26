import * as prismic from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
const typeEnum = 'pages';

type PageFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'page-formats'
>;

export const pageFormatsFetchLinks: FetchLinks<PageFormat> = [
  'page-formats.title',
  'page-formats.description',
];

export type WithPageFormat = {
  format: prismic.ContentRelationshipField<
    'page-formats',
    'en-gb',
    InferDataInterface<PageFormat>
  >;
};

export type PagePrismicDocument = prismic.PrismicDocument<
  {
    datePublished: prismic.TimestampField;
    isOnline: prismic.BooleanField;
    availableOnline: prismic.BooleanField;
    showOnThisPage: prismic.BooleanField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    WithPageFormat &
    CommonPrismicFields,
  typeof typeEnum
>;

export const pagesFetchLinks: FetchLinks<PagePrismicDocument> = [
  'pages.title',
  'pages.promo',
];
