// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {ArticleScheduleItem} from './article-schedule-items';
import type {ColorSelection} from './color-selections';

export type ArticleSeries = {|
  type: 'article-series',
  ...GenericContentFields,
  schedule: ArticleScheduleItem[],
  color: ColorSelection
|}
