import { PrismicResultsList, PrismicApiError } from '../types';
import { Event } from '../types/event';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: string;
  pageSize: number;
  type?: string;
};

export async function getEvents({
  query,
  pageSize,
}: PrismicQueryProps): Promise<PrismicResultsList<Event> | PrismicApiError> {
  try {
    const res = await prismicGraphQLClient('events', query, pageSize);
    const { allEventss } = await res;
    const exhibitions = await transformPrismicResponse(allEventss);
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
