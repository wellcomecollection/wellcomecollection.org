import * as prismic from '@prismicio/client';
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

export type ExhibitionFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'exhibition-formats'
>;

export type ExhibitionPrismicDocument = prismic.PrismicDocument<
  {
    format: prismic.ContentRelationshipField<
      'exhibition-formats',
      'en-gb',
      InferDataInterface<ExhibitionFormat>
    >;
    shortTitle: prismic.RichTextField;
    start: prismic.TimestampField;
    end: prismic.TimestampField;
    isPermanent: prismic.SelectField<'yes'>;
    statusOverride: prismic.RichTextField;
    place: prismic.ContentRelationshipField<'place'>;
    exhibits: prismic.GroupField<{
      item: prismic.ContentRelationshipField<
        'exhibitions',
        'en-gb',
        // We know this is an ExhibitionPrismicDocument, but the type checker gets
        // unhappy about the circular reference:
        //
        //    'event' is referenced directly or indirectly in its own type annotation.
        //
        // TODO: Find a better way to do this which doesn't upset the type checker.
        /* eslint-disable @typescript-eslint/no-explicit-any */
        InferDataInterface<any>
        /* eslint-enable @typescript-eslint/no-explicit-any */
      >;
    }>;
    events: prismic.GroupField<{
      item: prismic.ContentRelationshipField<'events'>;
    }>;
    articles: prismic.GroupField<{
      item: prismic.ContentRelationshipField<'articles'>;
    }>;
    accessResourcesPdfs: prismic.GroupField<{
      linkText: prismic.RichTextField;
      documentLink: prismic.LinkToMediaField;
    }>;
    accessResourcesText: prismic.RichTextField;
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
