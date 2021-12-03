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
} from './types';

const typeEnum = 'pages';

type PageFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'page-formats'
>;

export type PagesPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'page-formats',
      'en-gb',
      InferDataInterface<PageFormat>
    >;
    datePublished: TimestampField;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    showOnThisPage: BooleanField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;
