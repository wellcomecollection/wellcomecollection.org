// @flow
import {type Weight} from './weight';
import {type ArticlePromo} from './article-promo';

export type Promo = {|
  modifiers: Array<string>;
  article: ArticlePromo;
  weight?: Weight,
  meta?: {
    type?: string,
    length?: string,
    chapters?: {
      number: number,
      total: number,
      color: string
    }
  };
|}

export function createPromo(data: Promo) { return (data: Promo); }
