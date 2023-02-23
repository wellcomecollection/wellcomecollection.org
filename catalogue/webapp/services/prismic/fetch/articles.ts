import { Story, PrismicResultsList, PrismicApiError } from '../types';
import { Query } from '@weco/catalogue/types/search';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';
import { gql } from 'graphql-request';

export const storiesQuery = gql`
  query getAllStories(
    $queryString: String
    # The below $sortBy type needs to be SortArticlesy, rather than String, or you will get the following error from Prismic GraphQl:
    #  ClientError: Variable '$sortBy' of type 'String' used in position expecting type 'SortArticlesy'
    $sortBy: SortArticlesy
    $pageSize: Int
    $cursor: String
  ) {
    allArticless(
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
            ... on ArticleFormats {
              __typename
              title
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
            ... on ArticlesBodyStandfirst {
              primary {
                text
              }
            }
          }
          promo {
            ... on ArticlesPromoEditorialimage {
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

export async function getStories({
  query,
  pageSize,
}: PrismicQueryProps): Promise<PrismicResultsList<Story> | PrismicApiError> {
  try {
    // Create a map of all cursors to their respective page number by pageSize
    // A cursor is a pointer to a node within the returned list of results from a graphql query
    const fetchAllCursors = async (query: Query, pageSize: number) => {
      const results = await prismicGraphQLClient(query, 100);
      const { allArticless } = await results;
      const { edges } = allArticless;
      const getStoriesCursors = edges.map(edge => {
        return {
          cursor: edge.cursor,
        };
      });
      // We now get the first and nth cursor for first and nth page based on pageSize
      const cursorsPaginated = (cursors, pageSize: number) =>
        cursors
          .filter((cursor, cursorIndex) => {
            const position = cursorIndex - 1;
            return position % pageSize === 0;
          })
          .map((e, index) => ({
            cursor: e.cursor,
            page: (index + 1) as number,
          }));

      return cursorsPaginated(getStoriesCursors, pageSize);
    };

    // Get the relevant cursor for the page number
    const currentPageCursor = async (query: Query, pageSize: number) => {
      const allCursors = await fetchAllCursors(query, pageSize);
      const currentPage = query.page ? query.page : 1;

      const getCurrentPageCursor = allCursors.find(
        cursor => cursor.page === parseFloat(String(currentPage))
      );
      return getCurrentPageCursor?.cursor;
    };

    // Call the prismicGraphQLClient function with queryString from query and get nth number of stories by pageSize
    // Then, it will transform the above response into a list of stories in the format of ResultList
    // If the query contains a page number, it will query the prismicGraphQLClient function with the cursor
    // and get the next nth number of stories by pageSize
    const fetchStories = async (
      query: Query,
      pageSize: number,
      cursor?: string
    ): Promise<PrismicResultsList<Story> | PrismicApiError> => {
      const { allArticless } = await prismicGraphQLClient(
        query,
        pageSize,
        cursor
      );

      const { edges } = allArticless;

      const stories = await transformPrismicResponse(edges);

      return {
        type: 'ResultList',
        totalResults: allArticless.totalCount,
        totalPages: Math.ceil(allArticless.totalCount / pageSize),
        results: stories,
        pageSize: pageSize,
        prevPage: null,
        nextPage: null,
      };
    };

    // To work with existing pagination component we paginate with query.page
    // If we have query.page, we will use current page number to get the relevant cursor
    if (query.page) {
      const cursor = await currentPageCursor(query, pageSize);
      return fetchStories(query, pageSize, cursor);
    }
    return fetchStories(query, pageSize);
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
