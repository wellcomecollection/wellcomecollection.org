import {
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  BooleanField,
} from '@prismicio/types';
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

export type WithPageFormat = {
  format: RelationField<
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
