import { Article } from '../../../types/articles';
import { ArticlePrismicDocument } from '../types/articles';
import {
  asText,
  isDocumentLink,
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
import { transformMultiContent } from './multi-content';
import { transformGenericFields } from '.';
import { MultiContent as DeprecatedMultiContent } from '@weco/common/model/multi-content';
import { isNotUndefined } from '@weco/common/utils/array';
import { Label } from '@weco/common/model/labels';
import { Series } from 'types/series';

function transformContentLink(
  document?: LinkField
): DeprecatedMultiContent | undefined {
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
    return transformMultiContent(document) as
      | DeprecatedMultiContent
      | undefined;
  }
}

export function transformArticle(document: ArticlePrismicDocument): Article {
  const { data } = document;
  const genericFields = transformGenericFields(document);

  // When we imported data into Prismic from the Wordpress blog some content
  // needed to have its original publication date displayed. It is purely a display
  // value and does not affect ordering.
  const datePublished =
    data.publishDate || document.first_publication_date || undefined;

  const format = isDocumentLink(data.format)
    ? parseLabelType(data.format)
    : null;

  const series: Series[] = parseSingleLevelGroup(data.series, 'series').map(
    series => {
      return parseArticleSeries(series);
    }
  );

  const labels: Label[] = [
    format ? { text: format.title || '' } : undefined,
    series.find(s => s.schedule.length > 0) ? { text: 'Serial' } : undefined,
  ].filter(isNotUndefined);

  return {
    ...genericFields,
    type: 'articles',
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    format,
    series,
    datePublished: london(datePublished).toDate(),
    seasons: parseSingleLevelGroup(data.seasons, 'season').map(season => {
      return parseSeason(season);
    }),
    outroResearchLinkText: asText(data.outroResearchLinkText),
    outroResearchItem: transformContentLink(data.outroResearchItem),
    outroReadLinkText: asText(data.outroReadLinkText),
    outroReadItem: transformContentLink(data.outroReadItem),
    outroVisitLinkText: asText(data.outroVisitLinkText),
    outroVisitItem: transformContentLink(data.outroVisitItem),
    prismicDocument: document,
  };
}
