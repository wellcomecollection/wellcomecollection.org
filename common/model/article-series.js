// @flow
import type {GenericContentFields} from './generic-content-fields';

export type ArticleSeries = {|
  type: 'article-series',
  ...GenericContentFields,
  schedule: {|
    title: string,
    publishDate: ?Date
  |}[]
|}
