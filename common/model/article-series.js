// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {ArticleScheduleItem} from './article-schedule-items';

export type ArticleSeries = {|
  type: 'article-series',
  ...GenericContentFields,
  schedule: ArticleScheduleItem[]
|}
