import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import { gql, GraphQLClient } from 'graphql-request';

import { PrismicApiError } from '../types';
import { unCamelCase, capitalize } from '@weco/common/utils/grammar';
import { ArticleFormatIds } from '@weco/common/data/content-format-ids';
import { Query } from '@weco/catalogue/services/prismic/types';
import { getPrismicSortValue } from '@weco/catalogue/utils/search';
import { storiesQuery } from './articles';
import { eventsQuery } from './events';
import { exhibitionsQuery } from './exhibitions';

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
  pageSize: number
): string => {
  // const { query: queryString, sort, sortOrder } = query;
  // const sortBy = getPrismicSortValue({ sort, sortOrder });

  // const query = gql`
  //   query getMovie($title: String!) {
  //     Movie(title: $title) {
  //       releaseDate
  //       actors {
  //         name
  //       }
  //     }
  //   }
  // `
  //
  // const variables = {
  //   title: 'Inception',
  // }
  // return gql`
  //   query {
  //     ${
  //       typesToPrismicGraphQLSchemaTypes[type]
  //       }(fulltext: "${queryString}" sortBy: ${sortBy} first: ${pageSize}) {
  //     totalCount
  //     pageInfo {
  //       hasNextPage
  //       startCursor
  //       endCursor
  //       hasPreviousPage
  //     }
  //       edges {
  //         cursor
  //         node {
  //           title
  //           _meta { id, firstPublicationDate }
  //           format {
  //             __typename
  //           }
  //           format {
  //             ...on ArticleFormats {
  //               _meta {
  //                 id
  //               }
  //             }
  //           }
  //           contributors {
  //             contributor {
  //               ...on People {
  //                 name
  //               }
  //             }
  //           }
  //           body {
  //             ...on ${capitalize(type)}BodyStandfirst {
  //               primary {
  //                 text
  //               }
  //             }
  //           }
  //           promo {
  //             ...on ${capitalize(type)}PromoEditorialimage {
  //               primary {
  //                 image
  //                 link
  //                 caption
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `;
  const { query: queryString, sort, sortOrder } = query;
  console.log(queryString, 'do we have this');
  const sortBy = getPrismicSortValue({ sort, sortOrder });
  const variables = { queryString: queryString?.toString(), sortBy, pageSize };
  console.log(query, 'what is the query at this point');

  return gql`
    query {
      ${
        typesToPrismicGraphQLSchemaTypes[type]
        // }(fulltext: "${queryString}" sortBy: ${sortBy} first: ${pageSize}) {
      }(fulltext: $queryString sortBy: $sortBy first: $pageSize after: $cursor) {
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

// We need the below function to query with the variables like currentCursor
// Once we can do that we can update where cursor is and pass through query
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

  const graphQLQuery = (type: string) => {
    console.log(type, 'what is the type');
    return graphQLQueries[type];
  };
  return graphqlClient.request(graphQLQuery(type), variables);
}

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});
