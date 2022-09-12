import { RichTextField } from '@prismicio/types';
import { ArticleBasic } from './articles';
import { SeriesBasic } from './series';
import { BookBasic } from './books';

export type StoriesLanding = {
  title: string;
  description: RichTextField;
  stories: (ArticleBasic | SeriesBasic)[];
  books: BookBasic[];
};
