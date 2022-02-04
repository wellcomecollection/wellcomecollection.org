// @flow
// This service is used for getting content of multiple types of content.
import { parsePage } from './pages';
import { parseEventSeries } from './event-series';
import { parseBook } from './books';
import { parseEventDoc } from './events';
import { parseArticleDoc } from './articles';
import { parseExhibitionDoc } from './exhibitions';
import { parseArticleSeries } from './article-series';
import type { MultiContent } from '../../model/multi-content';
import type { PrismicDocument } from './types';

export function parseMultiContent(
  documents: PrismicDocument[]
): MultiContent[] {
  return documents
    .map(document => {
      switch (document.type) {
        case 'pages':
          return parsePage(document);
        case 'event-series':
          return parseEventSeries(document);
        case 'books':
          return parseBook(document);
        case 'events':
          return parseEventDoc(document);
        case 'articles':
        case 'webcomics':
          return parseArticleDoc(document);
        case 'exhibitions':
          return parseExhibitionDoc(document);
        case 'series':
          return parseArticleSeries(document);
      }
    })
    .filter(Boolean);
}
