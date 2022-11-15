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

const typeEnum = 'guides';

export type GuideFormatPrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'guide-formats'
>;

export const guideFormatsFetchLinks: FetchLinks<GuideFormatPrismicDocument> = [
  'guide-formats.title',
  'guide-formats.description',
];

export type WithGuideFormat = {
  format: RelationField<
    'guide-formats',
    'en-gb',
    InferDataInterface<GuideFormatPrismicDocument>
  >;
};

export type GuidePrismicDocument = PrismicDocument<
  {
    datePublished: TimestampField;
    availableOnline: BooleanField;
    showOnThisPage: BooleanField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    WithGuideFormat &
    CommonPrismicFields,
  typeof typeEnum
>;

export const guideFetchLinks: FetchLinks<GuidePrismicDocument> = [
  'guides.title',
  'guides.promo',
];
