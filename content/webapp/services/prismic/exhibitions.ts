import {
  GroupField,
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  SelectField,
} from '@prismicio/types';
import {
  CommonPrismicData,
  InferDataInterface,
  WithContributors,
  WithParents,
  WithSeasons,
} from './types';

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
    WithParents &
    WithSeasons &
    CommonPrismicData,
  typeof typeEnum
>;
