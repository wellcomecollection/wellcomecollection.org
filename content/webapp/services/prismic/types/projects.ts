import {
  TimestampField,
  PrismicDocument,
  ContentRelationshipField,
  RichTextField,
} from '@prismicio/client';
import {
  CommonPrismicFields,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
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
    format: ContentRelationshipField<
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
