import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { pageDescriptions } from '@weco/common/data/microcopy';
import SubNavigation from '@weco/common/views/components/SubNavigation/SubNavigation';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';

const SearchLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();

  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);

  const basePageMetadata = {
    openGraphType: 'website',
    siteSection: 'collections',
    jsonLd: { '@type': 'WebPage' },
    hideNewsletterPromo: true,
  } as const;

  const defaultPageLayoutMetadata = {
    ...basePageMetadata,
    title: 'Search Page',
    description: 'TBC',
    url: { pathname: '/search', query: {} },
  };

  const [pageLayoutMetadata, setPageLayoutMetadata] = useState(
    defaultPageLayoutMetadata
  );

  const getURL = pathname => {
    return convertUrlToString({
      pathname,
      query: router.query,
    });
  };

  useEffect(() => {
    const { query } = router.query;

    switch (currentSearchCategory) {
      case 'overview':
        setPageLayoutMetadata(defaultPageLayoutMetadata);
        break;
      case 'exhibitions':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Exhibition Search`,
          url: { pathname: '/search/exhibitions', query: query || {} },
        });
        break;
      case 'events':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Events Search`,
          url: { pathname: '/search/events', query: query || {} },
        });
        break;
      case 'stories':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Stories Search`,
          url: { pathname: '/search/stories', query: query || {} },
        });
        break;
      case 'images':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.images,
          title: `${query ? `${query} | ` : ''}Image Search`,
          url: { pathname: '/search/images', query: query || {} },
        });
        break;
      case 'collections':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Collections Search`,
          url: { pathname: '/search/collections', query: query || {} },
        });
        break;

      default:
        break;
    }
  }, [currentSearchCategory]);

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <div className="container">
        <input placeholder="search..." type="search" />
        <SubNavigation
          label="Search Categories"
          items={[
            {
              id: 'overview',
              url: getURL('/search'),
              name: 'Overview (1032)',
            },
            {
              id: 'exhibitions',
              url: getURL('/search/exhibitions'),
              name: 'Exhibitions (1032)',
            },
            {
              id: 'events',
              url: getURL('/search/events'),
              name: 'Events (1032)',
            },
            {
              id: 'stories',
              url: getURL('/search/stories'),
              name: 'Stories (1032)',
            },
            {
              id: 'images',
              url: getURL('/search/images'),
              name: 'Images (1032)',
            },
            {
              id: 'catalogue',
              url: getURL('/search/catalogue'),
              name: 'Catalogue (1032)',
            },
          ]}
          currentSection={currentSearchCategory}
          hasDivider
          variant="yellow"
        />
      </div>
      {children}
    </CataloguePageLayout>
  );
};

export const getSearchLayout = (page: ReactElement): JSX.Element => (
  <SearchLayout>{page}</SearchLayout>
);

export default SearchLayout;
