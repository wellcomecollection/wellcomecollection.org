// @flow

export type ArticleScheduleItem = {|
  type: 'article-schedule-items',
  id: string,
  title: string,
  url: string,
  publishDate: Date,
  partNumber: number
|}
