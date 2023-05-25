import {
  GroupField,
  TimestampField,
  PrismicDocument,
  ContentRelationshipField,
  RichTextField,
  SelectField,
} from '@prismicio/client';
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
    format: ContentRelationshipField<
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
    place: ContentRelationshipField<'place'>;
    exhibits: GroupField<{
      item: ContentRelationshipField<
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
      item: ContentRelationshipField<'events'>;
    }>;
    articles: GroupField<{
      item: ContentRelationshipField<'articles'>;
    }>;
    resources: GroupField<{
      item: ContentRelationshipField<'resources'>;
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
