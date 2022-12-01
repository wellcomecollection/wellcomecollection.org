import { useRouter } from 'next/router';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar';
import Space from '@weco/common/views/components/styled/Space';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import SubNavigation from '@weco/common/views/components/SubNavigation/SubNavigation';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { trackEvent } from '@weco/common/utils/ga';
import { removeEmptyProps } from '@weco/common/utils/json';
import { getUrlQueryFromSortValue } from '@weco/common/utils/search';
import { capitalize } from '@weco/common/utils/grammar';

const SearchBarContainer = styled(Space)`
  ${props => props.theme.media('medium', 'max-width')`
    margin-bottom:0;
  `}
`;

const SearchLayout: FunctionComponent<{ hasEventsExhibitions: boolean }> = ({
  children,
  hasEventsExhibitions,
}) => {
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
      // In development
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

      default:
        break;
    }
  }, [currentSearchCategory]);

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);

    if (formValues.query) {
      const sortOptionValue = formValues?.sortOrder
        ? Array.isArray(formValues.sortOrder)
          ? formValues.sortOrder[0]
          : formValues.sortOrder
        : '';

      const { sort, sortOrder } = getUrlQueryFromSortValue(sortOptionValue);

      router.push({
        pathname: router.pathname,
        query: removeEmptyProps({ ...formValues, sortOrder, sort }),
      });
    } else {
      router.push({
        pathname: router.pathname,
        query: {},
      });
    }
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
        <h1 className="visually-hidden">
          {`${capitalize(currentSearchCategory)} search page`}
        </h1>

        <SearchBarContainer
          v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
        >
          <SearchBar type={currentSearchCategory} />
        </SearchBarContainer>

        <SubNavigation
          label="Search Categories"
          items={[
            {
              id: 'overview',
              url: getURL('/search'),
              name: 'Overview',
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
            ...(hasEventsExhibitions
              ? [
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
                ]
              : []),
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

export const getSearchLayout = (page: ReactElement): JSX.Element => {
  const { searchPageEventsExhibitions } = page.props.serverData.toggles;

  return (
    <SearchLayout hasEventsExhibitions={searchPageEventsExhibitions}>
      {page}
    </SearchLayout>
  );
};

export default SearchLayout;
