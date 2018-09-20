// @flow
import type {HTMLString} from '../services/prismic/types';
import type {GenericContentFields} from './generic-content-fields';

export type ArticleSeries = {|
  type: 'article-series',
  ...GenericContentFields,
  id: string,
  title: ?string,
  description: ?HTMLString
|}
