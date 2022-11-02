import { useRouter } from 'next/router';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';

import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar';
import Space from '@weco/common/views/components/styled/Space';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import SubNavigation from '@weco/common/views/components/SubNavigation/SubNavigation';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { trackEvent } from '@weco/common/utils/ga';

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
    excludeRoleMain: true,
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
    const query = { query: router.query.query };
    return convertUrlToString({
      pathname,
      query,
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
      case 'works':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: 'copy pending',
          title: `${query ? `${query} | ` : ''}Catalogue Search`,
          url: { pathname: '/search/collections', query: query || {} },
        });
        break;

      default:
        break;
    }
  }, [currentSearchCategory]);

  const updateUrl = (form: HTMLFormElement) => {
    const urlQuery = formDataAsUrlQuery(form);
    console.log(urlQuery);
    router.push({ pathname: router.pathname, query: urlQuery });
  };

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <div className="container">
        <form
          role="search"
          id="searchPageForm"
          onSubmit={event => {
            event.preventDefault();

            trackEvent({
              category: 'SearchForm',
              action: 'submit search',
              label: router.query.query as string,
            });

            updateUrl(event.currentTarget);
            return false;
          }}
        />
        <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
          <SearchBar type={currentSearchCategory} />
        </Space>

        <SubNavigation
          label="Search Categories"
          items={[
            {
              id: 'overview',
              url: getURL('/search'),
              name: 'Overview',
            },
            {
              id: 'exhibitions',
              url: getURL('/search/exhibitions'),
              name: 'Exhibitions',
            },
            {
              id: 'events',
              url: getURL('/search/events'),
              name: 'Events',
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
