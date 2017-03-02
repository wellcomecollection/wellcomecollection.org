// @flow
import {type Promo} from "./promo";

export type ArticleSeries = {|
  url: string;
  name: string;
  description?: string;
|}

export type Series = ArticleSeries & {|
  items: Array<Promo>;
  total: number;
  color: string;
|}
