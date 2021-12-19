import { GenericContentFields } from './generic-content-fields';
import { Page } from './pages';
import { ArticleSeries } from './article-series';

export type Season = GenericContentFields & {
  type: 'seasons';
  start: Date | undefined;
  end: Date | undefined;
  prismicDocument: any;
};

export type SeasonWithContent = {
  season: Season;
  articleSeries: ArticleSeries[];
  projects: Page[];
};
