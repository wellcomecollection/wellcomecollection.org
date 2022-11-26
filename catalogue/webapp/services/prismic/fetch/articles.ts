import { Story } from '../types/story';
import { PrismicResultsList, PrismicApiError, Query } from '../types';
import { prismicGraphQLClient, prismicApiError } from '.';
import { transformPrismicResponse } from '../transformers';

export type PrismicQueryProps = {
  query: Query;
  pageSize: number;
  type?: string;
};

// This function will:
// 1. Call the prismicGraphQLClient function with queryString from query and get nth number of stories by pageSize
// Then, it will transform the above response into a list of stories in the format of ResultList
// 2. If the query contains a page number, it will query the prismicGraphQLClient function with the cursor
// and get the next nth number of stories by pageSize
export async function getStories({
  query,
  pageSize,
}: PrismicQueryProps): Promise<PrismicResultsList<Story> | PrismicApiError> {
  try {
    console.log('<<<<<<< WE ARE IN GET STORIES');

    // TODO: clear up the types in the return objects
    // TODO: clear up the types in the frontend page
    // TODO: leave notes on why we are doing the cursor stuff

    // Create a map of all cursors to their respective page number by pageSize
    // A cursor is a pointer to a node within the return list of results from a graphql query
    const fetchAllCursors = async (
      type: string,
      query: Query,
      pageSize: number
    ) => {
      const results = await prismicGraphQLClient(type, query, 100);
      const { allArticless } = await results;
      const { edges } = allArticless;
      const getStoriesCursors = edges.map(edge => {
        return {
          cursor: edge.cursor,
        };
      });
      // We now get the first and nth cursor for first and nth page based on pageSize
      const cursorsPaginated = (cursors, pagesize) =>
        cursors
          .filter(
            (cursor, index) => index % pagesize === pagesize - 1 || index === 0
          )
          .map((e, index) => {
            return { cursor: e.cursor, page: index + 1 };
          });

      console.log(cursorsPaginated, 'cursorsPaginated');
      return cursorsPaginated(getStoriesCursors, pageSize);
    };

    // Get the relevant cursor for the page number
    const currentPageCursor = async (
      type: string,
      query: Query,
      pageSize: number
    ) => {
      const allCursors = await fetchAllCursors('articles', query, pageSize);
      const currentPage = query.page ? query.page : 1;
      const getCurrentPageCursor = allCursors.find(
        cursor => cursor.page === parseFloat(String(currentPage))
      );
      return getCurrentPageCursor?.cursor;
    };

    const fetchStories = async (
      type: string,
      query: Query,
      pageSize: number,
      cursor?: string
    ) => {
      const res = await prismicGraphQLClient(
        'articles',
        query,
        pageSize,
        cursor
      );
      console.log(query, 'what is the query in articles ts');

      const { allArticless } = await res;
      const { edges } = allArticless;

      const stories = await transformPrismicResponse(['articles'], edges);
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
    // If there is no query.page, we will use the page number to get the relevant cursor
    if (query.page) {
      const cursor = await currentPageCursor('articles', query, pageSize);
      console.log(cursor, 'do we have a cursor for this page');
      return fetchStories('articles', query, pageSize, cursor);
    }
    return fetchStories('articles', query, pageSize);
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
