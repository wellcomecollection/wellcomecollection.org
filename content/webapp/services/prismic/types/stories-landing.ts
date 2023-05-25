import {
  GroupField,
  RichTextField,
  PrismicDocument,
  ContentRelationshipField,
} from '@prismicio/client';
import { BookPrismicDocument } from './books';
import { ArticlePrismicDocument } from './articles';
import { SeriesPrismicDocument } from '../types/series';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type StoriesLandingPrismicDocument = PrismicDocument<{
  introText: RichTextField;
  storiesTitle: RichTextField;
  storiesDescription: RichTextField;
  stories: GroupField<{
    story: ContentRelationshipField<
      'stories',
      'en-us',
      InferDataInterface<
        Partial<ArticlePrismicDocument | SeriesPrismicDocument>
      >
    >;
  }>;
  booksTitle: RichTextField;
  booksDescription: RichTextField;
  books: GroupField<{
    book: ContentRelationshipField<
      'book',
      'en-us',
      InferDataInterface<Partial<BookPrismicDocument>>
    >;
  }>;
}>;
