import * as prismic from '@prismicio/client';

import { ArticleBasic } from './articles';
import { BookBasic } from './books';
import { SeriesBasic } from './series';

export type StoriesLanding = {
  id: string;
  introText: prismic.RichTextField;
  storiesTitle?: string;
  storiesDescription?: prismic.RichTextField;
  stories: (ArticleBasic | SeriesBasic)[];
  booksTitle?: string;
  booksDescription?: prismic.RichTextField;
  books: BookBasic[];
};
