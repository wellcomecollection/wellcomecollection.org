import { PrismicResultsList, PrismicApiError } from '../types/index';
import { Exhibition } from '../types/exhibition';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: Query;
  pageSize: number;
  type?: string;
};

export type Query = {
  query?: string | string[];
  sortOrder?: string;
};

export async function getExhibitions({
  query,
  pageSize,
}: PrismicQueryProps): Promise<
  PrismicResultsList<Exhibition> | PrismicApiError
> {
  try {
    const res = await prismicGraphQLClient('exhibitions', query, pageSize);
    const { allExhibitionss } = await res;
    const { edges } = allExhibitionss;
    const exhibitions = await transformPrismicResponse(['exhibitions'], edges);
    return {
      type: 'ResultList',
      totalResults: allExhibitionss.totalCount,
      totalPages: Math.ceil(allExhibitionss.totalCount / pageSize),
      results: exhibitions as Exhibition[],
      pageSize: pageSize,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
