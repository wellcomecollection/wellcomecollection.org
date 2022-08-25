import { Article, ArticleBasic } from '../../../types/articles';
import { ArticlePrismicDocument } from '../types/articles';
import { london } from '@weco/common/utils/format-date';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToWebField,
} from '@weco/common/services/prismic/types';
import { LinkField } from '@prismicio/types';
import { transformMultiContent } from './multi-content';
import {
  asText,
  transformGenericFields,
  transformLabelType,
  transformSingleLevelGroup,
} from '.';
import { MultiContent } from '../../../types/multi-content';
import { isNotUndefined } from '@weco/common/utils/array';
import { Label } from '@weco/common/model/labels';
import { Series } from '../../../types/series';
import { transformSeason } from './seasons';
import { transformSeries } from './series';
import { SeriesPrismicDocument } from '../types/series';
import { SeasonPrismicDocument } from '../types/seasons';
import { Format } from '../../../types/format';
import { ArticleFormatId } from '@weco/common/data/content-format-ids';
import { transformContributors } from './contributors';

function transformContentLink(document?: LinkField): MultiContent | undefined {
  if (!document) {
    return;
  }

  if (isFilledLinkToWebField(document)) {
    return document.url
      ? {
          type: 'weblinks',
          id: document.url,
          url: document.url,
        }
      : undefined;
  }

  if (isFilledLinkToDocumentWithData(document)) {
    return transformMultiContent(document);
  }
}

export function transformArticleToArticleBasic(article: Article): ArticleBasic {
  // returns what is required to render StoryPromos and story JSON-LD
  return (({
    type,
    id,
    promo,
    series,
    title,
    format,
    image,
    datePublished,
    labels,
    color,
  }) => ({
    type,
    id,
    promo,
    series,
    title,
    format,
    image,
    datePublished,
    labels,
    color,
  }))(article);
}

export function transformArticle(document: ArticlePrismicDocument): Article {
  const { data } = document;
  const genericFields = transformGenericFields(document);

  // When we imported data into Prismic from the Wordpress blog some content
  // needed to have its original publication date displayed. It is purely a display
  // value and does not affect ordering.
  const datePublished =
    data.publishDate || document.first_publication_date || undefined;

  const format = isFilledLinkToDocumentWithData(data.format)
    ? (transformLabelType(data.format) as Format<ArticleFormatId>)
    : undefined;

  const series: Series[] = transformSingleLevelGroup(data.series, 'series').map(
    series => transformSeries(series as SeriesPrismicDocument)
  );

  const labels: Label[] = [
    format ? { text: format.title || '' } : undefined,
    series.find(s => s.schedule.length > 0) ? { text: 'Serial' } : undefined,
  ].filter(isNotUndefined);

  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'articles',
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    format,
    series,
    contributors,
    datePublished: london(datePublished).toDate(),
    seasons: transformSingleLevelGroup(data.seasons, 'season').map(season =>
      transformSeason(season as SeasonPrismicDocument)
    ),
    outroResearchLinkText: asText(data.outroResearchLinkText),
    outroResearchItem: transformContentLink(data.outroResearchItem),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: transformContentLink(data.outroReadItem),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: transformContentLink(data.outroVisitItem),
  };
}
