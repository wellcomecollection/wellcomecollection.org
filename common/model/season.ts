import { GenericContentFields } from './generic-content-fields';
import { Article } from './articles';
import { Book } from './books';
import { Event } from './events';
import { Exhibition } from './exhibitions';

export type Season = GenericContentFields & {
  type: 'seasons';
};

export type SeasonWithContent = {
  season: Season;
  articles: Article[] | null;
  books: Book[] | null;
  events: Event[] | null;
  exhibitions: Exhibition[] | null;
};
