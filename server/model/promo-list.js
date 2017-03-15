// @flow
// type: ui-component
import {List} from 'immutable';
import {type Promo, PromoFactory} from './promo';
import {type Series} from './series';

type PromoList = {|
  name: string;
  total: number;
  items: List<Promo>;
  url?: string;
  description?: string;
|}

export class PromoListFactory {
  static fromSeries(series: Series): PromoList {
    const promos: List<Promo> = series.items.map(p => PromoFactory.fromArticleStub(p));
    return ({
      name: series.name,
      description: series.description,
      total: series.total,
      url: series.url,
      items: promos
    }: PromoList);
  }
}
