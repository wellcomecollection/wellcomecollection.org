import { RichTextField } from '@prismicio/client';
import { ArticleBasic } from './articles';
import { SeriesBasic } from './series';
import { BookBasic } from './books';

export type StoriesLanding = {
  id: string;
  introText: RichTextField;
  storiesTitle?: string;
  storiesDescription?: RichTextField;
  stories: (ArticleBasic | SeriesBasic)[];
  booksTitle?: string;
  booksDescription?: RichTextField;
  books: BookBasic[];
};
