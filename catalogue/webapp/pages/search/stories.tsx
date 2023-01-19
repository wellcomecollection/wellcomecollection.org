import { GetServerSideProps } from 'next';
import styled from 'styled-components';

// Components
import Space from '@weco/common/views/components/styled/Space';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import Sort from '@weco/catalogue/components/Sort/Sort';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import StoriesGrid from 'components/StoriesGrid/StoriesGrid';

// Utils & Helpers
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { getStories } from '@weco/catalogue/services/prismic/fetch/articles';
import { Pageview } from '@weco/common/services/conversion/track';
import { pluralize } from '@weco/common/utils/grammar';

// Types
import { Story } from '@weco/catalogue/services/prismic/types/story';
import {
  PrismicApiError,
  PrismicResultsList,
} from '@weco/catalogue/services/prismic/types';
import { Query } from '@weco/catalogue/types/search';

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

  // If there is no query, return an empty page
  if (!queryString) {
    return (
      <Space
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
      ></Space>
    );
  }

  return (
    <Wrapper v={{ size: 'l', properties: ['padding-bottom'] }}>
      {storyResponseList.totalResults === 0 ? (
        <SearchNoResults query={queryString} hasFilters={false} />
      ) : (
        <div className="container">
          <PaginationWrapper verticalSpacing="l">
            <span>{pluralize(storyResponseList.totalResults, 'result')}</span>

            <SortPaginationWrapper>
              <Sort
                formId="searchPageForm"
                options={[
                  { value: 'alphabetical.asc', text: 'A-Z' },
                  { value: 'alphabetical.desc', text: 'Z-A' },
                  { value: 'publication.dates.desc', text: 'Newest to oldest' },
                  { value: 'publication.dates.asc', text: 'Oldest to newest' },
                ]}
                jsLessOptions={{
                  sort: [
                    { value: 'alphabetical', text: 'Alphabetical' },
                    { value: 'publication.dates', text: 'Publication dates' },
                  ],
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

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  const query = context.query;

  const defaultProps = removeUndefinedProps({
    serverData,
    storyResponseList: { totalResults: 0 },
    query,
    pageview: {
      name: 'stories',
      properties: {},
    },
  });

  // Stop here if no query has been entered
  if (!query.query) {
    return {
      props: defaultProps,
    };
  }

  const storyResponseList: PrismicResultsList<Story> | PrismicApiError =
    await getStories({
      query,
      pageSize: 6,
    });

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
