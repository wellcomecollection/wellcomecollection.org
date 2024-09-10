import searchQueryParser from 'search-query-parser';
import { transformSeries } from './series';
import {
  MultiContentPrismicDocument,
  StructuredSearchQuery,
} from '@weco/content/services/prismic/types';
import { transformArticle } from './articles';
import { transformBook } from './books';
import { transformEventSeries } from './event-series';
import { transformEventBasic } from './events';
import { transformExhibition } from './exhibitions';
import { transformPage } from './pages';
import { MultiContent } from '@weco/content/types/multi-content';
import { transformCard } from './card';

export function parseQuery(query: string): StructuredSearchQuery {
  const structuredQuery = searchQueryParser.parse(query, {
    keywords: [
      'types',
      'type',
      'ids',
      'id',
      'tags',
      'tag',
      'pageSize',
      'orderings',
      // content type specific
      'article-series',
    ],
  });
  const arrayedStructuredQuery = Object.keys(structuredQuery).reduce(
    (acc, key) => {
      const value = structuredQuery[key];
      if (typeof value === 'string') {
        acc[key] = [value];
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {}
  ) as StructuredSearchQuery;

  return {
    types: arrayedStructuredQuery.types || [],
    type: arrayedStructuredQuery.type || [],
    ids: arrayedStructuredQuery.ids || [],
    id: arrayedStructuredQuery.id || [],
    tags: arrayedStructuredQuery.tags || [],
    tag: arrayedStructuredQuery.tag || [],
    orderings: arrayedStructuredQuery.orderings || [],
    pageSize: arrayedStructuredQuery.pageSize,
    'article-series': arrayedStructuredQuery['article-series'] || [],
  };
}

export const transformMultiContent = (
  document: MultiContentPrismicDocument
): MultiContent => {
  switch (document.type) {
    case 'pages':
      return transformPage(document);
    case 'event-series':
      return transformEventSeries(document);
    case 'books':
      return transformBook(document);
    case 'events':
      return transformEventBasic(document);
    case 'articles':
    case 'webcomics':
      return transformArticle(document);
    case 'exhibitions':
      return transformExhibition(document);
    case 'series':
      return transformSeries(document);
    case 'card':
      return transformCard(document);
  }
};
