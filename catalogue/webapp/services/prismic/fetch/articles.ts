import { Story } from '../types/story';
import { PrismicResultsList, PrismicApiError } from '../types/index';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: string;
  pageSize: number;
  type?: string;
};

// type: 'ResultList';
// totalResults: number;
// totalPages: number;
// results: Result[];
// pageSize: number;
// prevPage: string | null;
// nextPage: string | null;

export async function getStories({
  query,
  pageSize,
}: PrismicQueryProps): Promise<PrismicResultsList<Story> | PrismicApiError> {
  try {
    const res = await prismicGraphQLClient('articles', query, pageSize);
    const { allArticless } = await res;
    const { edges } = allArticless;
    const stories = await transformPrismicResponse(['articles'], edges);
    return {
      type: 'ResultList',
      totalResults: allArticless.totalCount,
      totalPages: Math.ceil(allArticless.totalCount / pageSize),
      results: stories,
      pageSize: pageSize,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
