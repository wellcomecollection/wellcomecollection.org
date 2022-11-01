import { PrismicResultsList, PrismicApiError } from '../types/index';
import { Exhibition } from '../types/exhibition';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: string;
  pageSize: number;
  type?: string;
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
    const exhibitions = await transformPrismicResponse(allExhibitionss);
    return {
      type: 'ResultList',
      results: exhibitions,
      totalResults: exhibitions.length,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
