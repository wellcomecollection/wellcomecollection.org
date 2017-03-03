// @flow
import {List} from 'immutable';
import {type Promo} from './promo';
import {type ArticleStub} from './article-stub';
import {type Pagination} from '../controllers/index';

export type ArticleSeries = {|
  url: string;
  name: string;
  description?: string;
  commissionedLength?: ?number;
|}

export type Series = ArticleSeries & {|
  items: Array<ArticleStub>;
  total: number;
  color: string;
|}

// Anything below is a massive hack due to the fact that we don't have a CMS that
// supports our concept or series.
export function getSeriesCommissionedLength(seriesUrl: string): ?number {
  const lookup = { 'electricity': 6 };
  return lookup[seriesUrl];
}

export function getForwardFill(series: Series): Series {
  const lookup: { [key: string]: List<Promo> } = {
    'electricity': List([])
  };

  const forwardFill = lookup[series.url];

  if (forwardFill) {
    const missingCount = series.commissionedLength - series.items.size;
    const usefulForwardFill = forwardFill.takeLast(missingCount);
    const newSeriesItems = series.items.concat(usefulForwardFill);
    series.items = newSeriesItems;
  }

  return series;
}
