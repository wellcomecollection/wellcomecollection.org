// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {Article} from './articles';
import type {ArticleScheduleItem} from './article-schedule-items';
import type {ColorSelection} from './color-selections';

export type ArticleSeries = {|
  type: 'article-series',
  ...GenericContentFields,
  schedule: ArticleScheduleItem[],
  color: ColorSelection,
  items: (Article | ArticleScheduleItem)[]
|}
