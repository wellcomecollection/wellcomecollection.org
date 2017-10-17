// @flow
import {List} from 'immutable';
import type {ArticleStub} from './article-stub';
import {series} from '../data/series';

type ChapterColor =
  | 'purple'
  | 'red'
  | 'orange'
  | 'turquoise';

export type ArticleSeries = {|
  url: string;
  name: string;
  description?: string;
  commissionedLength?: ?number;
  color?: ChapterColor;
|}

export type Series = {|
  id: string;
  url: string;
  name: string;
  description?: string;
  commissionedLength?: ?number;
  items: List<ArticleStub>;
  total: number;
  color: ChapterColor;
|}

// Anything below is a massive hack due to the fact that we don't have a CMS that
// supports our concept or series.
export function getUnpublishedSeries(seriesId: string): ?Series {
  return series.find(s => s.url === seriesId);
}

export function getForwardFill(series: Series): Series {
  const forwardFill = getUnpublishedSeries(series.url);

  if (forwardFill) {
    const missingCount = (forwardFill.commissionedLength || series.items.size) - series.items.size;
    const usefulForwardFill = forwardFill.items.takeLast(missingCount);
    const newSeriesItems = series.items.concat(usefulForwardFill);
    series.name = forwardFill.name;
    series.items = newSeriesItems;
  }

  return series;
}
