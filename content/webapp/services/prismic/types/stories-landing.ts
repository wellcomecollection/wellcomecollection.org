import {
  GroupField,
  RichTextField,
  PrismicDocument,
  RelationField,
} from '@prismicio/types';
import { BookPrismicDocument } from './books';
import { ArticlePrismicDocument } from './articles';
import { SeriesPrismicDocument } from '../types/series';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type StoriesLandingPrismicDocument = PrismicDocument<{
  introText: RichTextField;
  storiesTitle: RichTextField;
  storiesDescription: RichTextField;
  stories: GroupField<{
    story: RelationField<
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
    book: RelationField<
      'book',
      'en-us',
      InferDataInterface<Partial<BookPrismicDocument>>
    >;
  }>;
}>;
