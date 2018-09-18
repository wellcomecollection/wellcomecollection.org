// @flow
import type {ArticleSeries} from './article-series';
import type {GenericContentFields} from './generic-content-fields';
import type {LabelField} from './label-field';
import type {HTMLString} from '../services/prismic/types';

export type Article = {|
  type: 'articles',
  ...GenericContentFields,
  format: ?LabelField,
  summary: ?HTMLString,
  datePublished: Date,
  series: ArticleSeries[]
|}
