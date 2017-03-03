// @flow
import {type Promo} from "./promo";

export type ArticleSeries = {|
  url: string;
  name: string;
  description?: string;
  commissionedLength?: ?number;
|}

export type Series = ArticleSeries & {|
  items: Array<Promo>;
  total: number;
  color: string;
|}


export function getSeriesCommissionedLength(seriesUrl): ?number {
  const lookup = { 'lgbt': 3 };
  return lookup[seriesUrl];
}
