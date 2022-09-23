import { ColorSelection } from './color-selections';
import { ArticleFormatId } from '@weco/common/data/content-format-ids';
import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { MultiContent } from './multi-content';
import { Contributor } from './contributors';
import { Season } from './seasons';
import { Series, SeriesBasic } from './series';
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';

export type ArticleBasic = {
  // this is a mix of props from GenericContentFields and Article
  // and is only what is required to render ArticlePromos and json-ld
  type: 'articles';
  id: string;
  promo?: ImagePromo | undefined;
  series: SeriesBasic[];
  title: string;
  format?: Format<ArticleFormatId>;
  image?: ImageType;
  datePublished: Date;
  labels: Label[];
  color?: ColorSelection;
};

export type Article = GenericContentFields & {
  type: 'articles';
  format?: Format<ArticleFormatId>;
  readingTime?: string;
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

export function getPositionInSeries(article: ArticleBasic): number | undefined {
  const serialisedSeries = article.series.find(
    series => series.schedule.length > 0
  );
  if (serialisedSeries) {
    const titles = serialisedSeries.schedule.map(item => item.title);
    const index = titles.indexOf(article.title);
    return index > -1 ? index + 1 : undefined;
  }
}

export function getArticleColor(article: ArticleBasic): ColorSelection {
  return (
    article.series.map(series => series.color).find(Boolean) || 'accent.purple'
  );
}
