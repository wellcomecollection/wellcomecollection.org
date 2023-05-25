import {
  TimestampField,
  PrismicDocument,
  ContentRelationshipField,
  RichTextField,
  BooleanField,
} from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
const typeEnum = 'pages';

type PageFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'page-formats'
>;

export const pageFormatsFetchLinks: FetchLinks<PageFormat> = [
  'page-formats.title',
  'page-formats.description',
];

export type WithPageFormat = {
  format: ContentRelationshipField<
    'page-formats',
    'en-gb',
    InferDataInterface<PageFormat>
  >;
};

export type PagePrismicDocument = PrismicDocument<
  {
    datePublished: TimestampField;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    showOnThisPage: BooleanField;
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
