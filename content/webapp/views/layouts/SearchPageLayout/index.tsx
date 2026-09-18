import { useRouter } from 'next/router';
import {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { SiteSection } from '@weco/common/model/site-section';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';

import SearchNavigation from './SearchNavigation';

type PageLayoutMetadata = {
  openGraphType: 'website';
  jsonLd: { '@type': 'WebPage' };
  hideNewsletterPromo: true;
  excludeRoleMain: true;
  title: string;
  description: string;
  url: {
    pathname: string;
    query: Record<string, string | string[] | undefined>;
  };
  siteSection?: SiteSection;
  apiToolbarLinks?: ApiToolbarLink[];
};

type SearchLayoutProps = PropsWithChildren<{
  apiToolbarLinks: ApiToolbarLink[];
}>;

export function getPageLayoutMetadata(
  currentSearchCategory: string,
  queryString: string | undefined,
  apiToolbarLinks: ApiToolbarLink[]
): PageLayoutMetadata {
  const queryStringTitle = queryString ? `${queryString} | ` : '';

  const basePageMetadata: PageLayoutMetadata = {
    apiToolbarLinks,
    openGraphType: 'website',
    jsonLd: { '@type': 'WebPage' },
    hideNewsletterPromo: true,
    excludeRoleMain: true,
    title: `${queryStringTitle}Search`,
    description: pageDescriptions.search.overview,
    url: {
      pathname: '/search',
      query: queryString ? { query: queryString } : {},
    },
  };

  switch (currentSearchCategory) {
    case 'stories':
      return {
        ...basePageMetadata,
        description: pageDescriptions.search.stories,
        title: `${queryStringTitle}Stories search`,
        url: { ...basePageMetadata.url, pathname: '/search/stories' },
      };
    case 'images':
      return {
        ...basePageMetadata,
        description: pageDescriptions.search.images,
        title: `${queryStringTitle}Images search`,
        url: { ...basePageMetadata.url, pathname: '/search/images' },
      };
    case 'works':
      return {
        ...basePageMetadata,
        description: pageDescriptions.search.works,
        title: `${queryStringTitle}Catalogue search`,
        url: { ...basePageMetadata.url, pathname: '/search/works' },
      };
    case 'events':
      return {
        ...basePageMetadata,
        description: pageDescriptions.search.events,
        title: `${queryStringTitle}Events and exhibitions search`,
        url: { ...basePageMetadata.url, pathname: '/search/events' },
      };
    case 'concepts':
      return {
        ...basePageMetadata,
        description: pageDescriptions.search.concepts,
        title: `${queryStringTitle}Themes search`,
        url: { ...basePageMetadata.url, pathname: '/search/concepts' },
      };
    case 'overview':
    default:
      return basePageMetadata;
  }
}

const SearchLayout: FunctionComponent<SearchLayoutProps> = ({
  children,
  apiToolbarLinks,
}) => {
  const router = useRouter();
  const queryString = getQueryPropertyValue(router?.query?.query);
  const [queryValue, setQueryValue] = useState(queryString || '');
  const { setExtraApiToolbarLinks } = useSearchContext();

  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);

  const pageLayoutMetadata = getPageLayoutMetadata(
    currentSearchCategory,
    queryString,
    apiToolbarLinks
  );

  useEffect(() => {
    // This ensures that if somebody is on a search page, then does a search
    // from the global nav, we'll update the query string in the URL correctly --
    // and not keep whatever they were previously searching for.
    setQueryValue(queryString || '');
    setExtraApiToolbarLinks([]);
  }, [currentSearchCategory, queryString]);

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <Container>
        <SearchNavigation
          currentSearchCategory={currentSearchCategory}
          currentQueryValue={queryValue}
        />
      </Container>
      {children}
    </CataloguePageLayout>
  );
};

// Higher-order component to wrap a component with SearchLayout
export function withSearchLayout<
  P extends { apiToolbarLinks?: ApiToolbarLink[] },
>(WrappedComponent: ComponentType<P>): FunctionComponent<P> {
  return function SearchLayoutHOC(props: P) {
    return (
      <SearchLayout apiToolbarLinks={props.apiToolbarLinks || []}>
        <WrappedComponent {...props} />
      </SearchLayout>
    );
  };
}

export default SearchLayout;
