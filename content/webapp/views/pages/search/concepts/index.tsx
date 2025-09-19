import { NextPage } from 'next';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { pluralize } from '@weco/common/utils/grammar';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { 
  CatalogueResultsList,
  Concept 
} from '@weco/content/services/wellcome/catalogue/types';
import { Query } from '@weco/content/types/search';
import ConceptsSearchResults from '@weco/content/views/components/ConceptsSearchResults';
import Pagination from '@weco/content/views/components/Pagination';
import {
  toLink,
  ConceptsProps as ConceptsRouteProps,
} from '@weco/content/views/components/SearchPagesLink/Concepts';
import { withSearchLayout } from '@weco/content/views/layouts/SearchPageLayout';
import SearchNoResults from '@weco/content/views/pages/search/search.NoResults';

export type Props = {
  concepts: CatalogueResultsList<Concept>;
  conceptsRouteProps: ConceptsRouteProps;
  query: Query;
  apiToolbarLinks: ApiToolbarLink[];
};

const ConceptsSearchPage: NextPage<Props> = withSearchLayout(
  ({ concepts, conceptsRouteProps, query }) => {
    const { query: queryString } = query;

    const { setLink } = useSearchContext();
    const pathname = usePathname();
    useEffect(() => {
      const link = toLink(
        { ...conceptsRouteProps },
        `concepts_search_context_${pathname}`
      );
      setLink(link);
    }, [conceptsRouteProps]);

    const hasNoResults = concepts.totalResults === 0;

    return (
      <>
        <Head>
          {concepts.prevPage && (
            <link
              rel="prev"
              href={convertUrlToString(
                toLink(
                  { ...conceptsRouteProps, page: (conceptsRouteProps.page || 1) - 1 },
                  `search/paginator_${pathname}`
                ).as
              )}
            />
          )}
          {concepts.nextPage && (
            <link
              rel="next"
              href={convertUrlToString(
                toLink(
                  { ...conceptsRouteProps, page: conceptsRouteProps.page + 1 },
                  `search/paginator_${pathname}`
                ).as
              )}
            />
          )}
        </Head>

        <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
          <Container>
            {hasNoResults ? (
              <SearchNoResults
                query={queryString}
                hasFilters={false}
              />
            ) : (
              <>
                <PaginationWrapper $verticalSpacing="l">
                  <span role="status">
                    {pluralize(concepts.totalResults, 'result')}
                  </span>

                  <Pagination
                    totalPages={concepts.totalPages}
                    ariaLabel="Themes search pagination"
                    isHiddenMobile
                  />
                </PaginationWrapper>

                <main>
                  <ConceptsSearchResults concepts={concepts.results} />
                </main>

                <PaginationWrapper $verticalSpacing="l" $alignRight>
                  <Pagination
                    totalPages={concepts.totalPages}
                    ariaLabel="Themes search pagination"
                  />
                </PaginationWrapper>
              </>
            )}
          </Container>
        </Space>
      </>
    );
  }
);

export default ConceptsSearchPage;