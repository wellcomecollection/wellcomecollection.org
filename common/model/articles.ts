import { ArticleSeries } from './article-series';
import { GenericContentFields } from './generic-content-fields';
import { LabelField } from './label-field';
import { ColorSelection } from './color-selections';
import { MultiContent } from './multi-content';
import { Season } from './seasons';
import { EditorialSeriesColour } from './editorial-series';

export type Article = GenericContentFields & {
  type: 'articles';
  format?: LabelField;
  datePublished: Date;
  series: ArticleSeries[];
  seasons: Season[];
  color?: ColorSelection;
  outroResearchLinkText?: string;
  outroResearchItem?: MultiContent;
  outroReadLinkText?: string;
  outroReadItem?: MultiContent;
  outroVisitLinkText?: string;
  outroVisitItem?: MultiContent;
};

export function getPositionInSeries(article: Article): number | undefined {
  const serialisedSeries = article.series.find(
    series => series.schedule.length > 0
  );
  if (serialisedSeries) {
    const titles = serialisedSeries.schedule.map(item => item.title);
    const index = titles.indexOf(article.title);
    return index > -1 ? index + 1 : undefined;
  }
}

export function getArticleColor(article: Article): EditorialSeriesColour {
  return article.series.map(series => series.color).find(Boolean) || 'purple';
}
