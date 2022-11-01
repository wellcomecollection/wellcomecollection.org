import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import { GraphQLClient } from 'graphql-request';

export type GetServerSidePropsPrismicClient = {
  type: 'GetServerSidePropsPrismicClient';
  client: prismic.Client;
};

const endpoint = prismic.getRepositoryEndpoint('wellcomecollection');
const client = prismic.createClient(endpoint, { fetch });

export async function prismicGraphQLClient(query: string) {
  const graphqlClient = new GraphQLClient(
    prismic.getGraphQLEndpoint('wellcomecollection'),
    {
      method: 'get',
      fetch: client.graphQLFetch,
    }
  );

  return graphqlClient.request(query);
}
