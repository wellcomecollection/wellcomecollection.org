// @flow
import type {ColorSelection} from './color-selections';

export type ArticleScheduleItem = {|
  type: 'article-schedule-items',
  id: string,
  title: string,
  url: string,
  publishDate: Date,
  partNumber: number,
  color: ?ColorSelection
|}
