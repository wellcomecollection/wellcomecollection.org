import * as prismic from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

const typeEnum = 'guides';

export type GuideFormatPrismicDocument = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'guide-formats'
>;

export const guideFormatsFetchLinks: FetchLinks<GuideFormatPrismicDocument> = [
  'guide-formats.title',
  'guide-formats.description',
];

export type WithGuideFormat = {
  format: prismic.ContentRelationshipField<
    'guide-formats',
    'en-gb',
    InferDataInterface<GuideFormatPrismicDocument>
  >;
};

export type GuidePrismicDocument = prismic.PrismicDocument<
  {
    datePublished: prismic.TimestampField;
    availableOnline: prismic.BooleanField;
    showOnThisPage: prismic.BooleanField;
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
