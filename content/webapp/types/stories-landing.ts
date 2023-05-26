import * as prismic from '@prismicio/client';
import { ArticleBasic } from './articles';
import { SeriesBasic } from './series';
import { BookBasic } from './books';

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
