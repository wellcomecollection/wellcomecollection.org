import searchQueryParser from 'search-query-parser';
import { transformSeries } from './series';
import {
  MultiContentPrismicDocument,
  StructuredSearchQuery,
} from '../types/multi-content';
import { transformArticle } from './articles';
import { transformBook } from './books';
import { transformEventSeries } from './event-series';
import { transformEvent } from './events';
import { transformExhibition } from './exhibitions';
import { transformPage } from './pages';
import { Page } from 'types/pages';
import { EventSeries } from 'types/event-series';
import { Book } from 'types/books';
import { Event } from 'types/events';
import { Article } from 'types/articles';
import { Exhibition } from 'types/exhibitions';
import { Series } from 'types/series';

// TODO:
// * free text search
// * excludes
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

// TODO: Merge this with the MultiContent in the common lib.
export type MultiContent =
  | Page
  | EventSeries
  | Book
  | Event
  | Article
  | Exhibition
  | Series;

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
      return transformEvent(document);
    case 'articles':
    case 'webcomics':
      return transformArticle(document);
    case 'exhibitions':
      return transformExhibition(document);
    case 'series':
      return transformSeries(document);
  }
};
