import {
  GroupField,
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  SelectField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  InferDataInterface,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { ArticlePrismicDocument } from './articles';
import { BookPrismicDocument } from './books';
import { EventPrismicDocument } from './events';

const typeEnum = 'exhibitions';

type ExhibitionFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'exhibition-formats'
>;

export type ExhibitionPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'exhibition-formats',
      'en-gb',
      InferDataInterface<ExhibitionFormat>
    >;
    shortTitle: RichTextField;
    start: TimestampField;
    end: TimestampField;
    isPermanent: SelectField<'yes'>;
    statusOverride: RichTextField;
    bslInfo: RichTextField;
    audioDescriptionInfo: RichTextField;
    place: RelationField<'place'>;
    exhibits: GroupField<{
      item: RelationField<'exhibitions'>;
    }>;
    events: GroupField<{
      item: RelationField<'events'>;
    }>;
    articles: GroupField<{
      item: RelationField<'articles'>;
    }>;
    resources: GroupField<{
      item: RelationField<'resources'>;
    }>;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;

export type ExhibitionRelatedContentPrismicDocument =
  | ExhibitionPrismicDocument
  | EventPrismicDocument
  | ArticlePrismicDocument
  | BookPrismicDocument;
