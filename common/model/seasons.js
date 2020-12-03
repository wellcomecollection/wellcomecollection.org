// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { Article } from './articles';
import type { Book } from './books';
import type { Event } from './events';
import type { Exhibition } from './exhibitions';

export type Season = {
  ...GenericContentFields,
  type: 'seasons',
};

export type SeasonWithContent = {
  season: Season,
  articles: Article[],
  books: Book[],
  events: Event[],
  exhibitions: Exhibition[],
};
