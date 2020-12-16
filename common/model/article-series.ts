import { GenericContentFields } from './generic-content-fields';
import { Article } from './articles';
import { ArticleScheduleItem } from './article-schedule-items';
import { ColorSelection } from './color-selections';
import { Season } from './seasons';

type ItemType = Article | ArticleScheduleItem;

export type ArticleSeries = GenericContentFields & {
  type: 'series';
  schedule: ArticleScheduleItem[];
  items: readonly ItemType[];
  color?: ColorSelection;
  seasons: Season[];
};
