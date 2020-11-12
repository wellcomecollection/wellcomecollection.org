import { GenericContentFields } from './generic-content-fields';
import { Article } from './articles';
import { ArticleScheduleItem } from './article-schedule-items';
import { ColorSelection } from './color-selections';

type ItemType = Article | ArticleScheduleItem;

export type ArticleSeries = GenericContentFields & {
  type: 'series';
  schedule: ArticleScheduleItem[];
  items: ReadonlyArray<ItemType>;
  color?: ColorSelection;
};
