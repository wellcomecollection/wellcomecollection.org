// @flow
import {type ArticlePromo} from './article-promo';

export type Promo = {|
  modifiers: Array<string>;
  article: ArticlePromo;
  meta?: {
    type?: string,
    date?: string,
    length?: string
  };
|}

export function createPromo(data: Promo) { return (data: Promo); }
