// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { Event } from './events';
import type { Exhibition } from './exhibitions';
import type { Page } from './pages';
import type { ArticleSeries } from './article-series';

export type Season = {
  ...GenericContentFields,
  type: 'seasons',
  prismicDocument: any,
};

export type SeasonWithContent = {
  season: Season,
  events: Event[],
  exhibitions: Exhibition[],
  pages: Page[],
  articleSeries: ArticleSeries[],
};
