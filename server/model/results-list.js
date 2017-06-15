// @flow
import type { Work } from './work';

export type ResultsList = {|
  pageSize: number;
  totalPages: number;
  totalResults: number;
  results: Array<Work>;
|}

export function createResultsList(data: ResultsList) {
  return (data: ResultsList);
}
