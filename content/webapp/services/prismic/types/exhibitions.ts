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
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { ArticlePrismicDocument } from './articles';
import { BookPrismicDocument } from './books';
import { EventPrismicDocument } from './events';

const typeEnum = 'exhibitions';

export type ExhibitionFormat = PrismicDocument<
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
      item: RelationField<
        'exhibitions',
        'en-gb',
        // We know this is an ExhibitionPrismicDocument, but the type checker gets
        // unhappy about the circular reference:
        //
        //    'event' is referenced directly or indirectly in its own type annotation.
        //
        // TODO: Find a better way to do this which doesn't upset the type checker.
        InferDataInterface<any>
      >;
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
