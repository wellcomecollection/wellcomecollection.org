// @flow
import {List} from 'immutable';
import {type Promo} from './promo';
import {type ArticleStub} from './article-stub';
import {type Pagination} from '../controllers/index';

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
|}

export type Series = {|
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
const hardcodedHackySeries = List([
  ({
    url: 'electric-sublime',
    name: 'Electric Sublime',
    commissionedLength: getSeriesCommissionedLength('electric-sublime'),
    color: 'purple',
    items: List([
      ({
        contentType: 'article',
        headline: 'Thunderbolts and lightning',
        url: '',
        description: '',
        datePublished: new Date('2017-03-30')
      }: ArticleStub)
    ])
  }: Series)
]);

export function getSeriesCommissionedLength(seriesUrl: string): ?number {
  const lookup = { 'electric-sublime': 6 };
  return lookup[seriesUrl];
}

export function getUnpublishedSeries(seriesId: String): ?Series {
  return hardcodedHackySeries.find(s => s.url === seriesId);
}

export function getForwardFill(series: Series): List<ArticleStub> {
  const forwardFill = getUnpublishedSeries[series.url];

  if (forwardFill) {
    const missingCount = series.commissionedLength || series.items.size - series.items.size;
    const usefulForwardFill = forwardFill.takeLast(missingCount);
    const newSeriesItems = series.items.concat(usefulForwardFill);
    series.items = newSeriesItems;
  }

  return series;
}
