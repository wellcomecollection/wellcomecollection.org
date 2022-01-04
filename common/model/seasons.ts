import { GenericContentFields } from './generic-content-fields';
import { Page } from './pages';

export type Season = GenericContentFields & {
  type: 'seasons';
  start: Date | undefined;
  end: Date | undefined;
  prismicDocument: any;
};

export type SeasonWithContent = {
  season: Season;
  projects: Page[];
};
