import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import { gql, GraphQLClient } from 'graphql-request';
import { PrismicApiError } from '../types';
import { capitalize } from '@weco/common/utils/grammar';
import { ArticleFormatIds } from '@weco/common/data/content-format-ids'

export const typesToPrismicGraphQLSchemaTypes = {
  // types to graphql query schema types,
  events: 'allEventss',
  exhibitions: 'allExhibitionss',
  articles: 'allArticless',
  series: 'allSeriess',
  webcomics: 'allWebcomicss',
};

export const articleIdToLabel = (id: string) => {
  return Object.keys(ArticleFormatIds).find(
    key => ArticleFormatIds[key] === id
  );
};

export const prismicGraphQLQuery = (
  type: string,
  query?: string | string[],
  pageSize?: number
) => {
  return gql`
    query {
      ${
        typesToPrismicGraphQLSchemaTypes[type]
      }(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
        edges {
          node {
            title
            _meta { id, firstPublicationDate }
            format {
              __typename
            }
            format {
              ...on ArticleFormats {
                _meta {
                  id
                }
              }
            }
            contributors {
              contributor {
                ...on People {
                  name
                }
              }
            }
            body {
              ...on ${capitalize(type)}BodyStandfirst {
                primary {
                  text
                }
              }
            }
            promo {
              ...on ${capitalize(type)}PromoEditorialimage {
                primary {
                  image
                  link
                  caption
                }
              }
            }
          }
        }
      }
    }
  `;
};

const endpoint = prismic.getRepositoryEndpoint('wellcomecollection');
const client = prismic.createClient(endpoint, { fetch });

export async function prismicGraphQLClient(
  type: string,
  query: string,
  pageSize: number
) {
  const graphqlClient = new GraphQLClient(
    prismic.getGraphQLEndpoint('wellcomecollection'),
    {
      method: 'get',
      fetch: client.graphQLFetch,
    }
  );
  const graphQLQuery = prismicGraphQLQuery(type, query, pageSize);
  return graphqlClient.request(graphQLQuery);
}

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});
