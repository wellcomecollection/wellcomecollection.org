import * as prismic from '@prismicio/client';
import { BookPrismicDocument } from './books';
import { ArticlePrismicDocument } from './articles';
import { SeriesPrismicDocument } from '../types/series';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type StoriesLandingPrismicDocument = prismic.PrismicDocument<{
  introText: prismic.RichTextField;
  storiesTitle: prismic.RichTextField;
  storiesDescription: prismic.RichTextField;
  stories: prismic.GroupField<{
    story: prismic.ContentRelationshipField<
      'stories',
      'en-us',
      InferDataInterface<
        Partial<ArticlePrismicDocument | SeriesPrismicDocument>
      >
    >;
  }>;
  booksTitle: prismic.RichTextField;
  booksDescription: prismic.RichTextField;
  books: prismic.GroupField<{
    book: prismic.ContentRelationshipField<
      'book',
      'en-us',
      InferDataInterface<Partial<BookPrismicDocument>>
    >;
  }>;
}>;
