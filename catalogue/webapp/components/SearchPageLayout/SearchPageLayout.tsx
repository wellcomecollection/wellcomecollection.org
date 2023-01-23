import { ParsedUrlQuery } from 'querystring';
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
import { trackGaEvent } from '@weco/common/utils/ga';
import {
  getUrlQueryFromSortValue,
  getQueryPropertyValue,
} from '@weco/catalogue/utils/search';
import { capitalize } from '@weco/common/utils/grammar';
import { propsToQuery } from '@weco/common/utils/routes';

const SearchBarContainer = styled(Space)`
  ${props => props.theme.media('medium', 'max-width')`
    margin-bottom:0;
  `}
`;

type PageLayoutMetadata = {
  openGraphType: 'website';
  siteSection: 'collections';
  jsonLd: { '@type': 'WebPage' };
  hideNewsletterPromo: true;
  excludeRoleMain: true;
  title: string;
  description: string;
  url: {
    pathname: string;
    query: Record<string, string | string[] | undefined>;
  };
};

const SearchLayout: FunctionComponent<{ hasEventsExhibitions: boolean }> = ({
  children,
  hasEventsExhibitions,
}) => {
  const router = useRouter();
  const { query: queryString } = router.query;

  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);

  const basePageMetadata: PageLayoutMetadata = {
    openGraphType: 'website',
    siteSection: 'collections',
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

  const getURL = pathname => {
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
      // In development
      case 'exhibitions':
        setPageLayoutMetadata({
          ...basePageMetadata,
          description: pageDescriptions.search.exhibitions,
          title: `${queryStringTitle}Exhibitions search`,
          url: {
            ...basePageMetadata.url,
            pathname: '/search/exhibitions',
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

  const searchbarPlaceholderText = {
    overview: 'Search Wellcome Collection',
    stories: 'Search for stories',
    images: 'Search for images',
    works: 'Search the catalogue',
    exhibitions: 'Search for exhibitions',
    events: 'Search for events',
  };

  const linkResolver = params => {
    const queryWithSource = propsToQuery(params);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { source = undefined, ...queryWithoutSource } = {
      ...queryWithSource,
    };

    const as = {
      pathname: pageLayoutMetadata.url.pathname,
      query: queryWithoutSource as ParsedUrlQuery,
    };

    const href = {
      pathname: pageLayoutMetadata.url.pathname,
      query: queryWithSource,
    };

    return { href, as };
  };

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);

    const sortOptionValue = getQueryPropertyValue(formValues.sortOrder);
    const urlFormattedSort =
      sortOptionValue && getUrlQueryFromSortValue(sortOptionValue);

    const link = linkResolver({
      ...formValues,
      ...(urlFormattedSort && {
        sort: urlFormattedSort.sort,
        sortOrder: urlFormattedSort.sortOrder,
      }),
    });
    return router.push(link.href, link.as);
  };

  return (
    <CataloguePageLayout {...pageLayoutMetadata}>
      <div className="container">
        <form
          role="search"
          id="searchPageForm"
          onSubmit={event => {
            event.preventDefault();

            trackGaEvent({
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
          <SearchBar
            placeholder={searchbarPlaceholderText[currentSearchCategory]}
          />
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
