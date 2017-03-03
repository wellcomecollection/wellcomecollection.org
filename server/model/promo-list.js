// @flow
// type: ui-component
import {List} from 'immutable';
import {type Promo, PromoFactory} from './promo';
import {type Series} from './series';

type PromoList = {|
  name: string;
  description: string;
  total: number;
  url?: string;
  items: List<Promo>;
|}

export class PromoListFactory {
  static fromSeries(series: Series): PromoList {
    const promos = series.items.map(PromoFactory.fromArticleStub);
    return ({
      name: series.name,
      description: series.description,
      total: series.total,
      url: series.url,
      items: promos
    }: PromoList);
  }
}
