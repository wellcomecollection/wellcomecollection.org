// @flow
import type {HTMLString} from '../services/prismic/types';
export type ArticleSeries = {|
  type: 'article-series',
  id: string,
  title: ?string,
  description: ?HTMLString
|}
