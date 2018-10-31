// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {Article} from './articles';
import type {ArticleScheduleItem} from './article-schedule-items';
import type {ColorSelection} from './color-selections';

type ItemType = Article | ArticleScheduleItem;

export type ArticleSeries = {|
  type: 'series',
  ...GenericContentFields,
  schedule: ArticleScheduleItem[],
  color: ColorSelection,
  items: $ReadOnlyArray<ItemType>,
  color?: ?ColorSelection
|}
