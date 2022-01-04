// @flow
import type { GenericContentFields } from './generic-content-fields';
import type { ArticleSeries } from './article-series';

export type Season = {
  ...GenericContentFields,
  type: 'seasons',
  prismicDocument: any,
};

export type SeasonWithContent = {
  season: Season,
  articleSeries: ArticleSeries[],
};
