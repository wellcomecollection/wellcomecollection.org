import { GetServerSideProps } from 'next';
import styled from 'styled-components';

// Components
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import Sort from '@weco/catalogue/components/Sort/Sort';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import StoriesGrid from 'components/StoriesGrid/StoriesGrid';
import Space from '@weco/common/views/components/styled/Space';

// Utils & Helpers
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import { Pageview } from '@weco/common/services/conversion/track';
import { pluralize } from '@weco/common/utils/grammar';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { getArticles } from '@weco/catalogue/services/content/articles';

// Types
import {
  PrismicApiError,
  PrismicResultsList,
  Story,
} from '@weco/catalogue/services/prismic/types';
import { Query } from '@weco/catalogue/types/search';
import { Content } from '@weco/catalogue/services/content/types/api';

type Props = {
  storyResponseList: PrismicResultsList<Story>;
  query: Query;
  pageview: Pageview;
};

const Wrapper = styled(Space)`
  background-color: ${props => props.theme.color('neutral.200')};
`;

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${props => props.theme.media('medium', 'max-width')`
    flex: 1 1 50%;
    justify-content: flex-end;
  `}
`;

export const SearchPage: NextPageWithLayout<Props> = ({
  storyResponseList,
  query,
}) => {
  const { query: queryString } = query;

  return (
    <Wrapper v={{ size: 'l', properties: ['padding-bottom'] }}>
      {storyResponseList.totalResults === 0 ? (
        <div className="container">
          <SearchNoResults query={queryString} />
        </div>
      ) : (
        <div className="container">
          <PaginationWrapper verticalSpacing="l">
            <span>{pluralize(storyResponseList.totalResults, 'result')}</span>

            <SortPaginationWrapper>
              <Sort
                formId="search-page-form"
                options={[
                  // Default value to be left empty as to not be reflected in URL query
                  { value: 'publication.dates.asc', text: 'Oldest to newest' },
                  { value: '', text: 'Newest to oldest' },
                ]}
                jsLessOptions={{
                  sort: [{ value: '', text: 'Publication dates' }],
                  sortOrder: [
                    { value: 'asc', text: 'Ascending' },
                    { value: 'desc', text: 'Descending' },
                  ],
                }}
                defaultValues={{ sort: query.sort, sortOrder: query.sortOrder }}
              />
              <Pagination
                totalPages={storyResponseList.totalPages}
                ariaLabel="Stories search pagination"
                isHiddenMobile
              />
            </SortPaginationWrapper>
          </PaginationWrapper>

          <main>
            <StoriesGrid
              isDetailed
              stories={storyResponseList.results}
              dynamicImageSizes={{
                xlarge: 1 / 5,
                large: 1 / 5,
                medium: 1 / 5,
                small: 1,
              }}
            />
          </main>

          <PaginationWrapper verticalSpacing="l" alignRight>
            <Pagination
              totalPages={storyResponseList.totalPages}
              ariaLabel="Stories search pagination"
            />
          </PaginationWrapper>
        </div>
      )}
    </Wrapper>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const query = context.query;
  const { contentApi } = serverData.toggles;
  const defaultProps = removeUndefinedProps({
    serverData,
    storyResponseList: { totalResults: 0 },
    query,
    pageview: {
      name: 'stories',
      properties: {},
    },
  });

  // Sending page=1 to Prismic skips the two first results, which seems to have to do with the cursor work
  // This is a workaround that ensures we only send the page if relevant
  const { page, ...restOfQuery } = query;
  const pageNumber = page !== '1' && getQueryPropertyValue(page);

  // Setting a default order of descending publication date as default state
  // as the Prismic default is by "last updated"
  const storyResponseList:
    | PrismicResultsList<Story | Content>
    | PrismicApiError = contentApi
    ? await getArticles({
        params: {
          ...restOfQuery,
          sort: getQueryPropertyValue(query.sort) || 'publication.dates',
          sortOrder: getQueryPropertyValue(query.sortOrder) || 'desc',
          ...(pageNumber && { page: Number(pageNumber) }),
        },
        pageSize: 6,
        toggles: serverData.toggles,
      })
    : await getStories({
        query: {
          ...restOfQuery,
          sort: getQueryPropertyValue(query.sort) || 'publication.dates',
          sortOrder: getQueryPropertyValue(query.sortOrder) || 'desc',
          ...(pageNumber && { page: pageNumber }),
        },
        pageSize: 6,
      });

  if (storyResponseList.type === 'Error') {
    // Prismic returns Internal Server Errors without much details for certain queries, such as query=t:"PP.PRE.D.1.1"
    // As this is a temporary search tool until we replace it with our own API, we'll just return No Result should it happen
    return {
      props: removeUndefinedProps({
        ...defaultProps,
        storyResponseList: {
          type: 'ResultList',
          totalResults: 0,
          totalPages: 0,
          results: [],
          pageSize: 6,
        },
        pageview: {
          name: 'stories',
          properties: {
            totalResults: 0,
          },
        },
      }),
    };
  }

  return {
    props: removeUndefinedProps({
      ...defaultProps,
      storyResponseList,
      pageview: {
        name: 'stories',
        properties: {
          totalResults:
            storyResponseList?.type === 'ResultList'
              ? storyResponseList.totalResults
              : 0,
        },
      },
    }),
  };
};

export default SearchPage;
