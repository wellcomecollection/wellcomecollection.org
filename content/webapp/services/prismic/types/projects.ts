import * as prismic from '@prismicio/client';
import {
  CommonPrismicFields,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
const typeEnum = 'projects';

type ProjectFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'project-formats'
>;

export type ProjectPrismicDocument = prismic.PrismicDocument<
  {
    format: prismic.ContentRelationshipField<
      'project-formats',
      'en-gb',
      InferDataInterface<ProjectFormat>
    >;
    start: prismic.TimestampField;
    end: prismic.TimestampField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    CommonPrismicFields,
  typeof typeEnum
>;
