import { Article } from '../../../types/articles';
import { ArticlePrismicDocument } from '../types/articles';
import {
  asText,
  isDocumentLink,
  parseGenericFields,
  parseLabelType,
  parseSingleLevelGroup,
} from '@weco/common/services/prismic/parsers';
import { parseSeason } from '@weco/common/services/prismic/seasons';
import { parseArticleSeries } from '@weco/common/services/prismic/article-series';
import { london } from '@weco/common/utils/format-date';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToWebField,
} from '../types';
import { LinkField } from '@prismicio/types';
import { MultiContent, transformMultiContent } from './multi-content';
import { Weblink } from '@weco/common/model/weblinks';

export function transformContentLink(
  document?: LinkField
): MultiContent | Weblink | undefined {
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

export function transformArticle(document: ArticlePrismicDocument): Article {
  const { data } = document;
  // When we imported data into Prismic from the Wordpress blog some content
  // needed to have its original publication date displayed. It is purely a display
  // value and does not affect ordering.

  const datePublished =
    data.publishDate || document.first_publication_date || undefined;

  const article = {
    type: 'articles',
    ...parseGenericFields(document),
    format: isDocumentLink(data.format) ? parseLabelType(data.format) : null,
    datePublished: london(datePublished).toDate(),
    series: parseSingleLevelGroup(data.series, 'series').map(series => {
      return parseArticleSeries(series);
    }),
    seasons: parseSingleLevelGroup(data.seasons, 'season').map(season => {
      return parseSeason(season);
    }),
  };

  const labels = [
    article.format ? { text: article.format.title || '' } : null,
    article.series.find(series => series.schedule.length > 0)
      ? { text: 'Serial' }
      : null,
  ].filter(Boolean);

  return {
    ...article,
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    outroResearchLinkText: asText(data.outroResearchLinkText),
    outroResearchItem: transformContentLink(data.outroResearchItem),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: transformContentLink(data.outroReadItem),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: transformContentLink(data.outroVisitItem),
    prismicDocument: document,
  };
}
