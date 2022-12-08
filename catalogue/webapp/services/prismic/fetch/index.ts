import * as prismic from '@prismicio/client';
import { GraphQLClient } from 'graphql-request';
import { PrismicApiError } from '../types';
import { unCamelCase } from '@weco/common/utils/grammar';
import { ArticleFormatIds } from '@weco/common/data/content-format-ids';
import { Query } from '@weco/catalogue/types/search';
import { getPrismicSortValue } from '@weco/catalogue/utils/search';
import { storiesQuery } from './articles';
import { eventsQuery } from './events';
import { exhibitionsQuery } from './exhibitions';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';

export const articleIdToLabel = (id: string): string => {
  const label = Object.keys(ArticleFormatIds).find(
    key => ArticleFormatIds[key] === id
  );
  const formattedLabel = label ? unCamelCase(label) : 'Article';
  // TODO: Essay seems to indicate articles that are part of a series
  // More work to do here to make this label Serial with 'Part of' in the title
  return formattedLabel === 'Essay' ? 'Article' : formattedLabel;
};

const client = createPrismicClient();

export async function prismicGraphQLClient(
  type: string,
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

  const graphQLQueries = {
    articles: storiesQuery,
    events: eventsQuery,
    exhibitions: exhibitionsQuery,
  };

  return graphqlClient.request(graphQLQueries[type], variables);
}

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});
