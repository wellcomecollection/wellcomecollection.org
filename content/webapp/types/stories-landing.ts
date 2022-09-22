import { RichTextField } from '@prismicio/types';
import { ArticleBasic } from './articles';
import { SeriesBasic } from './series';
import { BookBasic } from './books';

export type StoriesLanding = {
  introText: RichTextField;
  storiesTitle?: string;
  storiesDescription?: RichTextField;
  stories: (ArticleBasic | SeriesBasic)[];
  booksTitle?: string;
  booksDescription?: RichTextField;
  books: BookBasic[];
};
