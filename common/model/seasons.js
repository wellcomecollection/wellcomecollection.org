// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { Page } from './pages';
import type { ArticleSeries } from './article-series';

export type Season = {
  ...GenericContentFields,
  type: 'seasons',
  prismicDocument: any,
};

export type SeasonWithContent = {
  season: Season,
  pages: Page[],
  articleSeries: ArticleSeries[],
};
