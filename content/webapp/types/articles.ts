import { ColorSelection } from './color-selections';
import { ArticleFormatId } from '@weco/common/services/prismic/content-format-ids';
import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { MultiContent } from './multi-content';
import { Contributor } from './contributors';
import { Season } from './seasons';
import { Series } from './series';

export type Article = GenericContentFields & {
  type: 'articles';
  format?: Format<ArticleFormatId>;
  datePublished: Date;
  series: Series[];
  seasons: Season[];
  color?: ColorSelection;
  outroResearchLinkText?: string;
  outroResearchItem?: MultiContent;
  outroReadLinkText?: string;
  outroReadItem?: MultiContent;
  outroVisitLinkText?: string;
  outroVisitItem?: MultiContent;
  contributors: Contributor[];
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

export function getArticleColor(article: Article): ColorSelection {
  return article.series.map(series => series.color).find(Boolean) || 'purple';
}
