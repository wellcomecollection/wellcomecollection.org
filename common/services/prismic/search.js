
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
  pageSize: number
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
      'size'
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
    pageSize: arrayedStructuredQuery.pageSize
  };
}
