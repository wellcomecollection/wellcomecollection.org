import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { linkResolver, SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import Pagination from '@weco/content/views/components/Pagination';
import SearchFilters from '@weco/content/views/components/SearchFilters';
import { withSearchLayout } from '@weco/content/views/components/SearchPageLayout';
import { StoriesProps } from '@weco/content/views/components/SearchPagesLink/Stories';
import Sort from '@weco/content/views/components/Sort';
import { storiesFilters } from '@weco/content/services/wellcome/common/filters';
import {
  Article,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';
import { Query } from '@weco/content/types/search';
import { getActiveFiltersLabel, hasFilters } from '@weco/content/utils/search';
import SearchNoResults from '@weco/content/views/pages/search/search.NoResults';

import StoriesGrid from './stories.Grid';

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

export type Props = {
  storyResponseList: ContentResultsList<Article>;
  query: Query;
  storiesRouteProps: StoriesProps;
  apiToolbarLinks?: ApiToolbarLink[];
};

const StoriesSearchPage: NextPageWithLayout<Props> = withSearchLayout(
  ({ storyResponseList, query, storiesRouteProps }) => {
    const { query: queryString } = query;

    const filters = storiesFilters({
      stories: storyResponseList,
      props: storiesRouteProps,
    });

    const hasNoResults = storyResponseList.totalResults === 0;
    const hasActiveFilters = hasFilters({
      filters: filters.map(f => f.id),
      queryParams: query,
    });

    const activeFiltersLabels = getActiveFiltersLabel({ filters });

    const sortOptions = [
      // Default value to be left empty as to not be reflected in URL query
      {
        value: '',
        text: 'Relevance',
      },
      {
        value: 'publicationDate.asc',
        text: 'Oldest to newest',
      },
      {
        value: 'publicationDate.desc',
        text: 'Newest to oldest',
      },
    ];

    return (
      <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
        {(!hasNoResults || (hasNoResults && hasActiveFilters)) && (
          <Container>
            <Space
              $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
            >
              <SearchFilters
                query={queryString}
                linkResolver={params =>
                  linkResolver({ params, pathname: '/search/stories' })
                }
                searchFormId={SEARCH_PAGES_FORM_ID}
                changeHandler={() => {
                  const form = document.getElementById(SEARCH_PAGES_FORM_ID);
                  form &&
                    form.dispatchEvent(
                      new window.Event('submit', {
                        cancelable: true,
                        bubbles: true,
                      })
                    );
                }}
                filters={filters}
                hasNoResults={hasNoResults}
              />
            </Space>
          </Container>
        )}
        {storyResponseList && (
          <Wrapper>
            {hasNoResults ? (
              <Container>
                <SearchNoResults
                  query={queryString}
                  hasFilters={hasActiveFilters}
                />
              </Container>
            ) : (
              <Container>
                <PaginationWrapper $verticalSpacing="l">
                  <span role="status">
                    {pluralize(storyResponseList.totalResults, 'result')}
                    {activeFiltersLabels.length > 0 && (
                      <span className="visually-hidden">
                        {' '}
                        filtered with: {activeFiltersLabels.join(', ')}
                      </span>
                    )}
                  </span>

                  <SortPaginationWrapper>
                    <Sort
                      formId={SEARCH_PAGES_FORM_ID}
                      options={sortOptions}
                      jsLessOptions={{
                        sort: [
                          {
                            value: '',
                            text: 'Relevance',
                          },
                          {
                            value: 'publicationDate',
                            text: 'Publication date',
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
                    articles={storyResponseList.results}
                    dynamicImageSizes={{
                      xlarge: 1 / 5,
                      large: 1 / 5,
                      medium: 1 / 5,
                      small: 1,
                    }}
                  />
                </main>

                <PaginationWrapper $verticalSpacing="l" $alignRight>
                  <Pagination
                    totalPages={storyResponseList.totalPages}
                    ariaLabel="Stories search pagination"
                  />
                </PaginationWrapper>
              </Container>
            )}
          </Wrapper>
        )}
      </Space>
    );
  }
);

export default StoriesSearchPage;
