import { PrismicResultsList, PrismicApiError } from '../types';
import { Event } from '../types/event';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformStories } from '../transformers/articles';
import { gql } from 'graphql-request';

export type PrismicQueryProps = {
  query?: string | string[];
  pageSize?: number;
};

export async function getEvents({
  query,
  pageSize,
}: PrismicQueryProps): Promise<PrismicResultsList<Event> | PrismicApiError> {
  const graphQuery = gql`query {
    allEventss(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
      edges {
        node {
          title
          _meta { id, lastPublicationDate }
          contributors {
            contributor {
              ...on People {
                name
              }
            }
          }
          body {
            ...on EventsBodyStandfirst {
              primary {
                text
              }
            }
          }
          promo {
            ...on EventsPromoEditorialimage {
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
  }`;
  try {
    const res = await prismicGraphQLClient(graphQuery);
    const { allEventss } = await res;
    const exhibitions = await transformStories(allEventss);
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
