// @flow
import type {ArticleSeries} from './article-series';
import type {GenericContentFields} from './generic-content-fields';
import type {LabelField} from './label-field';
import type {ColorSelection} from './color-selections';
import type {MultiContent} from './multi-content';

export type Article = {|
  type: 'articles',
  ...GenericContentFields,
  format: ?LabelField,
  datePublished: Date,
  series: ArticleSeries[],
  color?: ?ColorSelection,
  outroResearchLinkText: ?string,
  outroResearchItem: ?MultiContent,
  outroReadLinkText: ?string,
  outroReadItem: ?MultiContent,
  outroVisitLinkText: ?string,
  outroVisitItem: ?MultiContent
|}

export function getPositionInSeries(article: Article): ?number {
  const serialisedSeries = article.series.find(series => series.schedule.length > 0);
  if (serialisedSeries) {
    const titles = serialisedSeries.schedule.map(item => item.title);
    const index = titles.indexOf(article.title);
    return index > -1 ? index + 1 : null;
  }
}
