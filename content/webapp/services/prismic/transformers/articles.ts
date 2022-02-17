import { Article } from '../../../types/articles';
import { ArticlePrismicDocument } from '../types/articles';
import {
  asText,
  isDocumentLink,
  parseLabelType,
  parseSingleLevelGroup,
} from '@weco/common/services/prismic/parsers';
import { london } from '@weco/common/utils/format-date';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToWebField,
} from '../types';
import { LinkField } from '@prismicio/types';
import { MultiContent, transformMultiContent } from './multi-content';
import { Weblink } from '@weco/common/model/weblinks';
import { transformSeries } from './series';
import { transformSeason } from './seasons';
import { transformGenericFields } from '.';
import { isNotUndefined } from '@weco/common/utils/array';
import { MultiContent as DeprecatedMultiContent } from '@weco/common/model/multi-content';

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
    ...transformGenericFields(document),
    format: isDocumentLink(data.format) ? parseLabelType(data.format) : null,
    datePublished: london(datePublished).toDate(),
    series: parseSingleLevelGroup(data.series, 'series').map(series => {
      return transformSeries(series);
    }),
    seasons: parseSingleLevelGroup(data.seasons, 'season').map(season => {
      return transformSeason(season);
    }),
  };

  const labels = [
    article.format ? { text: article.format.title || '' } : undefined,
    article.series.find(series => series.schedule.length > 0)
      ? { text: 'Serial' }
      : undefined,
  ].filter(isNotUndefined);

  return {
    ...article,
    type: 'articles',
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    outroResearchLinkText: asText(data.outroResearchLinkText),
    outroResearchItem: transformContentLink(data.outroResearchItem) as (DeprecatedMultiContent | undefined),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: transformContentLink(data.outroReadItem) as (DeprecatedMultiContent | undefined),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: transformContentLink(data.outroVisitItem) as (DeprecatedMultiContent | undefined),
    prismicDocument: document,
  };
}
