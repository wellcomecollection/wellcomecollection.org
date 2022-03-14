import { ColorSelection } from './color-selections';
import { GenericContentFields } from './generic-content-fields';
import { ArticleScheduleItem } from './article-schedule-items';
import { ArticleBasic } from './articles';
import { Contributor } from './contributors';
import { Season } from './seasons';

export type Series = GenericContentFields & {
  type: 'series';
  schedule: ArticleScheduleItem[];
  color?: ColorSelection;
  seasons: Season[];
  items: ArticleBasic[];
  contributors: Contributor[];
};
