// @flow
import {type Weight} from './weight';
import {type ArticleStub} from './article-promo';

export type Promo = {|
  modifiers: Array<string>;
  article: ArticleStub;
  weight?: Weight,
  meta?: {
    type?: string,
    length?: string
  };
|}

export function createPromo(data: Promo) { return (data: Promo); }
