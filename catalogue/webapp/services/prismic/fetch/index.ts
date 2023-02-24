import * as prismic from '@prismicio/client';
import { GraphQLClient } from 'graphql-request';
import { PrismicApiError } from '../types';
import { Query } from '@weco/catalogue/types/search';
import { getPrismicSortValue } from '@weco/common/utils/search';
import { storiesQuery } from './articles';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';

const client = createPrismicClient();

export async function prismicGraphQLClient(
  query: Query,
  pageSize: number,
  cursor?: string
): Promise<any> {
  const graphqlClient = new GraphQLClient(
    prismic.getGraphQLEndpoint('wellcomecollection'),
    {
      method: 'get',
      fetch: client.graphQLFetch,
    }
  );

  const { query: queryString, sort, sortOrder } = query;
  const sortBy = getPrismicSortValue({ sort, sortOrder });

  // We pass through variables for graphql query, we only include cursor if we have it
  const variables = cursor
    ? { queryString, sortBy, pageSize, cursor }
    : { queryString, sortBy, pageSize };

  return graphqlClient.request(storiesQuery, variables);
}

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});
