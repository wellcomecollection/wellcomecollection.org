import { Story } from '../types/story';
import { PrismicResultsList, PrismicApiError } from '../types/index';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: string;
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
    const stories = await transformPrismicResponse(allArticless);
    return {
      type: 'ResultList',
      results: stories,
      totalResults: stories.length,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
