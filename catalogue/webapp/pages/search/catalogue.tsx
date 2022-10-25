import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps, appError } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import {
  fromQuery,
  toLink,
  WorksProps as WorksRouteProps,
} from '@weco/common/views/components/WorksLink/WorksLink';
import { Pageview } from '@weco/common/services/conversion/track';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { useContext, useEffect } from 'react';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import styled from 'styled-components';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksRouteProps;
  pageview: Pageview;
};

const SortPaginationWrapper = styled.div<{ showSort?: boolean }>`
  display: flex;
  justify-content: ${({ showSort }) =>
    showSort ? 'space-between' : 'flex-end'};
`;

export const CatalogueSearchPage: NextPageWithLayout<Props> = ({
  works,
  worksRouteProps,
}) => {
  const {
    query,
    'production.dates.from': productionDatesFrom,
    'production.dates.to': productionDatesTo,
  } = worksRouteProps;

  const { setLink } = useContext(SearchContext);
  useEffect(() => {
    const link = toLink({ ...worksRouteProps }, 'works_search_context');
    setLink(link);
  }, [worksRouteProps]);

  const showSort = true;

  return (
    <>
      <h1 className="visually-hidden">Works Search Page</h1>
      <div className="container">
        <Space v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}>
          <h2 style={{ marginBottom: 0 }}>Filters</h2>
        </Space>
      </div>

      {works.results.length > 0 && (
        <div className="container" role="main">
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            <SortPaginationWrapper showSort={showSort}>
              {showSort && <div>Sort Component</div>}
              <SearchPagination totalPages={works?.totalPages} />
            </SortPaginationWrapper>
          </Space>
          <Space v={{ size: 'l', properties: ['padding-top'] }}>
            <WorksSearchResults works={works} />
          </Space>
        </div>
      )}

      {works.results.length === 0 && (
        <SearchNoResults
          query={query}
          hasFilters={Boolean(productionDatesFrom || productionDatesTo)}
        />
      )}
    </>
  );
};

CatalogueSearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const props = fromQuery(context.query);

    const aggregations = [
      'workType',
      'availabilities',
      'genres.label',
      'languages',
      'subjects.label',
      'contributors.agent.label',
    ];

    const _queryType = getCookie('_queryType') as string | undefined;

    const worksApiProps = {
      ...props,
      _queryType,
      aggregations,
    };

    const works = await getWorks({
      params: worksApiProps,
      pageSize: 25,
      toggles: serverData.toggles,
    });

    if (works.type === 'Error') {
      return appError(
        context,
        works.httpStatus,
        works.description || works.label
      );
    }

    return {
      props: removeUndefinedProps({
        works,
        worksRouteProps: props,
        serverData,
        pageview: {
          name: 'works',
          properties: works ? { totalResults: works.totalResults } : {},
        },
      }),
    };
  };
export default CatalogueSearchPage;
