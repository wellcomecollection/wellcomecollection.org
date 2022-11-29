import { PrismicResultsList, PrismicApiError, Query } from '../types';
import { Event } from '../types/event';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';
import { gql } from 'graphql-request';

export const eventsQuery = gql`
  query getAllEvents(
    $queryString: String
    # The below $sortBy type needs to be SortEventsy, rather than String, or you will get the following error from Prismic GraphQl:
    #  ClientError: Variable '$sortBy' of type 'String' used in position expecting type 'SortEventsy'
    $sortBy: String
    $pageSize: Int
    $cursor: String
  ) {
    allEventss(
      fulltext: $queryString
      sortBy: $sortBy
      first: $pageSize
      after: $cursor
    ) {
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
          _meta {
            id
            firstPublicationDate
          }
          format {
            __typename
          }
          format {
            ... on EventFormats {
              _meta {
                id
              }
            }
          }
          contributors {
            contributor {
              ... on People {
                name
              }
            }
          }
          body {
            ... on EventsBodyStandfirst {
              primary {
                text
              }
            }
          }
          promo {
            ... on EventsPromoEditorialimage {
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

export type PrismicQueryProps = {
  query: Query;
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
    const { edges } = allEventss;
    const events = await transformPrismicResponse(['events'], edges);
    return {
      type: 'ResultList',
      totalResults: allEventss.totalCount,
      totalPages: Math.ceil(allEventss.totalCount / pageSize),
      results: events,
      pageSize: pageSize,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
