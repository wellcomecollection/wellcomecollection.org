// @flow
import type { Work } from './work';
import type { List } from './list';

export type ResultsList = {|
  pageSize: number;
  totalPages: number;
  totalResults: number;
  results: List<Work>;
|}

export function createResultsList(data: ResultsList) {
  return (data: ResultsList);
}
