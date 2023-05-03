import { GetServerSideProps } from 'next';
import styled from 'styled-components';

// Components
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import Sort from '@weco/catalogue/components/Sort/Sort';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import StoriesGrid from '@weco/catalogue/components/StoriesGrid';
import Space from '@weco/common/views/components/styled/Space';

// Utils & Helpers
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { Pageview } from '@weco/common/services/conversion/track';
import { pluralize } from '@weco/common/utils/grammar';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { getArticles } from '@weco/catalogue/services/wellcome/content/articles';

// Types
import { Query } from '@weco/catalogue/types/search';
import { Content } from '@weco/catalogue/services/wellcome/content/types/api';
import { ContentResultsList } from '@weco/catalogue/services/wellcome/content/types';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';

type Props = {
  storyResponseList?: ContentResultsList<Content>;
  query: Query;
  pageview: Pageview;
  apiToolbarLinks: ApiToolbarLink[];
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

  const sortOptions = [
    // Default value to be left empty as to not be reflected in URL query
    {
      value: '',
      text: 'Relevance',
    },
    {
      value: 'publication.dates.asc',
      text: 'Oldest to newest',
    },
    {
      value: 'publication.dates.desc',
      text: 'Newest to oldest',
    },
  ];

  return (
    <Wrapper v={{ size: 'l', properties: ['padding-bottom'] }}>
      {storyResponseList && (
        <>
          {storyResponseList.totalResults === 0 ? (
            <div className="container">
              <SearchNoResults query={queryString} />
            </div>
          ) : (
            <div className="container">
              <PaginationWrapper verticalSpacing="l">
                <span>
                  {pluralize(storyResponseList.totalResults, 'result')}
                </span>

                <SortPaginationWrapper>
                  <Sort
                    formId="search-page-form"
                    options={sortOptions}
                    jsLessOptions={{
                      sort: [
                        {
                          value: '',
                          text: 'Relevance',
                        },
                        {
                          value: 'publication.dates',
                          text: 'Publication dates',
                        },
                      ],
                      sortOrder: [
                        { value: 'asc', text: 'Ascending' },
                        { value: 'desc', text: 'Descending' },
                      ],
                    }}
                    defaultValues={{
                      sort: query.sort,
                      sortOrder: query.sortOrder,
                    }}
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
                  articles={storyResponseList.results}
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
        </>
      )}
    </Wrapper>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
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

  // Sending page=1 to Prismic skips the two first results, which seems to have to do with the cursor work
  // This is a workaround that ensures we only send the page if relevant
  const { page, ...restOfQuery } = query;
  const pageNumber = page !== '1' && getQueryPropertyValue(page);

  const storyResponseList = await getArticles({
    params: {
      ...restOfQuery,
      sort: getQueryPropertyValue(query.sort),
      sortOrder: getQueryPropertyValue(query.sortOrder),
      ...(pageNumber && { page: Number(pageNumber) }),
    },
    pageSize: 6,
    toggles: serverData.toggles,
  });

  if (storyResponseList?.type === 'Error') {
    return appError(context, storyResponseList.httpStatus, 'Content API error');
  }

  return {
    props: removeUndefinedProps({
      ...defaultProps,
      storyResponseList,
      pageview: {
        name: 'stories',
        properties: {
          totalResults: storyResponseList?.totalResults ?? 0,
        },
      },
      apiToolbarLinks: [
        {
          id: 'content-api',
          label: 'Content API query',
          link: storyResponseList._requestUrl,
        },
      ],
    }),
  };
};

export default SearchPage;
