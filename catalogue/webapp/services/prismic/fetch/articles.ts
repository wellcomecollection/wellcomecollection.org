import { Story } from '../types/story';
import { PrismicResultsList, PrismicApiError, Query } from '../types';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: Query;
  pageSize: number;
  type?: string;
};

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
      results: stories as Story[],
      pageSize: pageSize,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
