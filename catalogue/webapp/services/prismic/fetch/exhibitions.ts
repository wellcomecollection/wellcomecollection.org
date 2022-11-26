import { PrismicResultsList, PrismicApiError, Query } from '../types';
import { Exhibition } from '../types/exhibition';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';
import { gql } from 'graphql-request';

export const exhibitionsQuery = gql`
  query getAllExhibitions(
    $queryString: String
    $sortBy: SortArticlesy
    $pageSize: Int
    $cursor: String
  ) {
    allExhibitions(
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
            ... on ExhibitionFormats {
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
            ... on ExhibitionsBodyStandfirst {
              primary {
                text
              }
            }
          }
          promo {
            ... on ExhibitionsPromoEditorialimage {
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

export async function getExhibitions({
  query,
  pageSize,
}: PrismicQueryProps): Promise<
  PrismicResultsList<Exhibition> | PrismicApiError
> {
  try {
    const res = await prismicGraphQLClient('exhibitions', query, pageSize);
    const { allExhibitionss } = await res;
    const { edges } = allExhibitionss;
    const exhibitions = await transformPrismicResponse(['exhibitions'], edges);
    return {
      type: 'ResultList',
      totalResults: allExhibitionss.totalCount,
      totalPages: Math.ceil(allExhibitionss.totalCount / pageSize),
      results: exhibitions,
      pageSize: pageSize,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
