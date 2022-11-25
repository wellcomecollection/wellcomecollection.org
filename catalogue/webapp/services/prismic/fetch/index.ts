import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import { gql, GraphQLClient } from 'graphql-request';

import { PrismicApiError } from '../types';
import { unCamelCase, capitalize } from '@weco/common/utils/grammar';
import { ArticleFormatIds } from '@weco/common/data/content-format-ids';
import { Query } from '@weco/catalogue/types/search';
import { getPrismicSortValue } from '@weco/catalogue/utils/search';

export const typesToPrismicGraphQLSchemaTypes = {
  // types to graphql query schema types,
  events: 'allEventss',
  exhibitions: 'allExhibitionss',
  articles: 'allArticless',
  series: 'allSeriess',
  webcomics: 'allWebcomicss',
};

export const articleIdToLabel = (id: string): string => {
  const label = Object.keys(ArticleFormatIds).find(
    key => ArticleFormatIds[key] === id
  );
  const formattedLabel = label ? unCamelCase(label) : 'Article';
  // TODO: Essay seems to indicate articles that are part of a series
  // More work to do here to make this label Serial with 'Part of' in the title
  return formattedLabel === 'Essay' ? 'Article' : formattedLabel;
};

export const prismicGraphQLQuery = (
  type: string,
  query: Query,
  pageSize?: number
): string => {
  const { query: queryString, sort, sortOrder } = query;
  const sortBy = getPrismicSortValue({ sort, sortOrder });

  return gql`
    query {
      ${
        typesToPrismicGraphQLSchemaTypes[type]
      }(fulltext: "${queryString}" sortBy: ${sortBy} first: ${pageSize} ) {
      totalCount
      pageInfo {
        hasNextPage
        startCursor
        endCursor
        hasPreviousPage
      }
        edges {
          cursor
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
  query: Query,
  pageSize: number
): Promise<any> {
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
