// @flow
import {type DisplayType} from './display-type';
import {type ArticlePromo} from './article-promo';

export type Promo = {|
  modifiers: Array<string>;
  article: ArticlePromo;
  meta?: {
    display?: DisplayType,
    small?: boolean,
    type?: string,
    length?: string
  };
|}

export function createPromo(data: Promo) { return (data: Promo); }
