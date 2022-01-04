import { GenericContentFields } from './generic-content-fields';
import { Exhibition } from './exhibitions';
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
  exhibitions: Exhibition[];
  pages: Page[];
  articleSeries: ArticleSeries[];
  projects: Page[];
};
