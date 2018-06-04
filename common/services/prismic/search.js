
// @flow
import searchQueryParser from 'search-query-parser';
import {getMultiContent} from './multi-content';

export type StructuredSearchQuery = {|
  types: string[],
  type: string[],
  ids: string[],
  id: string[],
  tags: string[],
  tag: string[],
  pageSize: number,
  orderings: string[],
  'my.events.interpretations.interpretationType': string[]
|}

export async function search(req: Request, stringQuery: string) {
  const query = parseQuery(stringQuery);
  return getMultiContent(req, query);
}

// TODO:
// * free text search
// * excludes
export function parseQuery(query: string): StructuredSearchQuery {
  const structuredQuery = searchQueryParser.parse(query, {
    keywords: [
      'types', 'type',
      'ids', 'id',
      'tags', 'tag',
      'pageSize', 'orderings',
      // TODO: Make this dynamic as it's very much not sustainable.
      // We can probably do this from the prismic models.
      'my.events.interpretations.interpretationType'
    ]
  });
  const arrayedStructuredQuery = Object.entries(structuredQuery).reduce((acc, entry) => {
    const [key, value] = entry;
    if (typeof value === 'string') {
      acc[key] = [value];
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  return {
    types: arrayedStructuredQuery.types || [],
    type: arrayedStructuredQuery.type || [],
    ids: arrayedStructuredQuery.ids || [],
    id: arrayedStructuredQuery.id || [],
    tags: arrayedStructuredQuery.tags || [],
    tag: arrayedStructuredQuery.tag || [],
    orderings: arrayedStructuredQuery.orderings || [],
    pageSize: arrayedStructuredQuery.pageSize,
    'my.events.interpretations.interpretationType': arrayedStructuredQuery['my.events.interpretations.interpretationType'] || []
  };
}
