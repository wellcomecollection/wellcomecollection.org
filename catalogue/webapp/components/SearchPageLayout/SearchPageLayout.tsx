import { useRouter } from 'next/router';
import {
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';

import { pageDescriptions } from '@weco/common/data/microcopy';
import SubNavigation from '@weco/common/views/components/SubNavigation/SubNavigation';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';

type PageLayoutMetadata = {
  openGraphType: 'website';
  siteSection: null;
  jsonLd: { '@type': 'WebPage' };
  hideNewsletterPromo: true;
  excludeRoleMain: true;
  title: string;
  description: string;
  url: {
    pathname: string;
    query: Record<string, string | string[] | undefined>;
  };
  apiToolbarLinks?: ApiToolbarLink[];
};

const SearchLayout: FunctionComponent<
  PropsWithChildren<{ apiToolbarLinks: ApiToolbarLink[] }>
> = ({ children, apiToolbarLinks }) => {
  const router = useRouter();
  const queryString = getQueryPropertyValue(router?.query?.query);

  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);

  const basePageMetadata: PageLayoutMetadata = {
    apiToolbarLinks,
    openGraphType: 'website',
    siteSection: null, // We don't want search to display under any menu section
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

  const getURL = (pathname: string) => {
    return convertUrlToString({
      pathname,
      query: { query: queryString },
    });
  };

  useEffect(() => {
    const queryStringTitle = queryString ? `${queryString} | ` : '';

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

      default:
        break;
    }
  }, [currentSearchCategory, queryString]);

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <div className="container">
        <SearchForm />
        <SubNavigation
          label="Search Categories"
          items={[
            {
              id: 'overview',
              url: getURL('/search'),
              name: 'All',
            },
            {
              id: 'stories',
              url: getURL('/search/stories'),
              name: 'Stories',
            },
            {
              id: 'images',
              url: getURL('/search/images'),
              name: 'Images',
            },
            {
              id: 'works',
              url: getURL('/search/works'),
              name: 'Catalogue',
            },
          ]}
          currentSection={currentSearchCategory}
          hasDivider
        />
      </div>
      {children}
    </CataloguePageLayout>
  );
};

export const getSearchLayout = (page: ReactElement): JSX.Element => (
  <SearchLayout apiToolbarLinks={page.props.apiToolbarLinks}>
    {page}
  </SearchLayout>
);

export default SearchLayout;
