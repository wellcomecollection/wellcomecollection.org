import { useRouter } from 'next/router';
import {
  FunctionComponent,
  JSX,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { SiteSection } from '@weco/common/model/site-section';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';

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

  const basePageMetadata: PageLayoutMetadata = {
    apiToolbarLinks,
    openGraphType: 'website',
    jsonLd: { '@type': 'WebPage' },
    hideNewsletterPromo: true,
    excludeRoleMain: true,
    title: `${queryString ? `${queryString} | ` : ''}Search`,
    description: pageDescriptions.search.overview,
    url: {
      pathname: '/search',
      query: queryString ? { query: queryString } : {},
    },
  };

  const [pageLayoutMetadata, setPageLayoutMetadata] =
    useState<PageLayoutMetadata>(basePageMetadata);

  useEffect(() => {
    const queryStringTitle = queryString ? `${queryString} | ` : '';

    // This ensures that if somebody is on a search page, then does a search
    // from the global nav, we'll update the query string in the URL correctly --
    // and not keep whatever they were previously searching for.
    setQueryValue(queryString || '');
    setExtraApiToolbarLinks([]);

    switch (currentSearchCategory) {
      case 'overview':
        setPageLayoutMetadata({
          ...basePageMetadata,
          title: `${queryStringTitle}Search`,
        });
        break;
      case 'stories':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.search.stories,
          title: `${queryStringTitle}Stories search`,
          url: {
            ...basePageMetadata.url,
            pathname: '/search/stories',
          },
        });
        break;
      case 'images':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.search.images,
          title: `${queryStringTitle}Images search`,
          url: {
            ...basePageMetadata.url,
            pathname: '/search/images',
          },
        });
        break;
      case 'works':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.search.works,
          title: `${queryStringTitle}Catalogue search`,
          url: {
            ...basePageMetadata.url,
            pathname: '/search/works',
          },
        });
        break;
      case 'events':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.search.events,
          title: `${queryStringTitle}Events search`,
          url: {
            ...basePageMetadata.url,
            pathname: '/search/events',
          },
        });
        break;

      default:
        break;
    }
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

export const getSearchLayout = (page: ReactElement): JSX.Element => (
  <SearchLayout apiToolbarLinks={(page.props as { apiToolbarLinks?: ApiToolbarLink[] })?.apiToolbarLinks || []}>
    {page}
  </SearchLayout>
);

export default SearchLayout;
