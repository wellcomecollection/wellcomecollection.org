import {
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  BooleanField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  InferDataInterface,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';

const typeEnum = 'guides';

export type GuideFormatPrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'guide-formats'
>;

export type GuidePrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'guide-formats',
      'en-gb',
      InferDataInterface<GuideFormatPrismicDocument>
    >;
    datePublished: TimestampField;
    availableOnline: BooleanField;
    showOnThisPage: BooleanField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;
