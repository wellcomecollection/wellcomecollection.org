import { PrismicResultsList, PrismicApiError } from '../types/index';
import { Exhibition } from '../types/exhibition';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformStories } from '../transformers/articles';

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
    const exhibitions = await transformStories(allExhibitionss);
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
