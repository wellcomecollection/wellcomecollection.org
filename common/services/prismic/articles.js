// $FlowFixMe
import { london } from '../../utils/format-date';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseLabelType,
  isDocumentLink,
  asText,
} from './parsers';
import { parseMultiContent } from './multi-content';
import { parseArticleSeries } from './article-series';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import type { Article } from '../../model/articles';
import type { MultiContent } from '../../model/multi-content';
import type { PrismicDocument } from './types';

export function parseContentLink(document: ?PrismicDocument): ?MultiContent {
  if (!document) {
    return;
  }

  if (document.link_type === 'Web') {
    return document.url
      ? {
          type: 'weblinks',
          id: document.url,
          url: document.url,
        }
      : null;
  }

  if (document.isBroken !== false) {
    return;
  }

  const parsedDocuments = parseMultiContent([document]);
  return parsedDocuments.length > 0 ? parsedDocuments[0] : null;
}

export function parseArticleDoc(document: PrismicDocument): Article {
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
    outroResearchItem: parseContentLink(data.outroResearchItem),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: parseContentLink(data.outroReadItem),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: parseContentLink(data.outroVisitItem),
    prismicDocument: document,
  };
}
