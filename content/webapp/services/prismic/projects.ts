import {
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  InferDataInterface,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from './types';

const typeEnum = 'projects';

type ProjectFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'project-formats'
>;

export type ProjectPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'project-formats',
      'en-gb',
      InferDataInterface<ProjectFormat>
    >;
    start: TimestampField;
    end: TimestampField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;
