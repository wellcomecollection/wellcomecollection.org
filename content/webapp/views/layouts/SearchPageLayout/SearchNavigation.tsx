import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { searchLabelText } from '@weco/common/data/microcopy';
import { useToggles } from '@weco/common/server-data/Context';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import { capitalize } from '@weco/common/utils/grammar';
import {
  getQueryPropertyValue,
  getUrlQueryFromSortValue,
  linkResolver,
  SEARCH_PAGES_FORM_ID,
} from '@weco/common/utils/search';
import SearchBar from '@weco/common/views/components/SearchBar';
import Space from '@weco/common/views/components/styled/Space';
import PrototypeSearchSelects from '@weco/content/views/components/PrototypeSearchSelects';
import Tabs from '@weco/content/views/components/Tabs';
const SearchBarContainer = styled(Space)`
  ${props => props.theme.media('sm', 'max-width')`
    margin-bottom:0;
  `}
`;

const TabsBorder = styled.div<{ $visible?: boolean }>`
  border-bottom: ${props =>
    props.$visible ? `1px solid ${props.theme.color('neutral.300')}` : 'none'};
`;

type SearchNavigationProps = {
  currentSearchCategory: string;
  currentQueryValue: string;
};

// Performance note: this component will be re-rendered every time a user
// changes the text input field, and the search term they entered won't
// appear until it finishes rendering.
//
// This component should be kept small, so these re-renders are fast,
// and we don't introduce any lag into the user typing.
//
// (Historical note: previously this was inline in SearchPageLayout,
// which introduced noticeable latency as we had to re-render most of the
// page on every keystroke.  You really felt it!)
const SearchNavigation: FunctionComponent<SearchNavigationProps> = ({
  currentSearchCategory,
  currentQueryValue: queryValue,
}) => {
  const router = useRouter();
  const { conceptsSearch, semanticSearchPrototype, semanticSearchComparison } =
    useToggles();

  // Variable naming note:
  //
  //    - `currentQueryValue` is whatever query was used to render
  //      the currently-loaded search results
  //    - `inputValue` is whatever the user has typed into the search
  //      input field
  //
  const [inputValue, setInputValue] = useState(queryValue || '');

  // This ensures that if somebody is on a search page, then does a search
  // from the global nav, we'll update the text in the search box to match --
  // replacing whatever they'd been searching for previously.
  useEffect(() => {
    setInputValue(queryValue);
  }, [queryValue]);

  const getURL = (pathname: string) => {
    return convertUrlToString({
      pathname,
      // Note: we use `inputValue` instead of `currentQueryValue` because if
      // a user clicks on a tab, we want to run a search with whatever is
      // currently entered in the search input field.
      query: { query: inputValue },
    });
  };

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);

    const sortOptionValue = getQueryPropertyValue(formValues.sortOrder);
    const urlFormattedSort = sortOptionValue
      ? getUrlQueryFromSortValue(sortOptionValue)
      : undefined;

    // now to strip the page number if page is not what has changed
    if (formValues.page === router.query.page) {
      delete formValues.page;
    }

    const link = linkResolver({
      params: {
        ...formValues,
        ...(urlFormattedSort && {
          sort: urlFormattedSort.sort,
          sortOrder: urlFormattedSort.sortOrder,
        }),
      },
      pathname: router.pathname,
    });

    return router.push(link.href);
  };

  const tabItems = [
    {
      id: 'overview',
      url: getURL('/search'),
      text: 'All',
    },
    {
      id: 'works',
      url: getURL('/search/works'),
      text: 'Catalogue',
    },
    {
      id: 'images',
      url: getURL('/search/images'),
      text: 'Images',
    },
    ...(conceptsSearch
      ? [
          {
            id: 'concepts',
            url: getURL('/search/concepts'),
            text: 'Themes',
          },
        ]
      : []),
    {
      id: 'events',
      url: getURL('/search/events'),
      text: 'Events and exhibitions',
    },
    {
      id: 'stories',
      url: getURL('/search/stories'),
      text: 'Stories',
    },
  ];

  return (
    <>
      <form
        role="search"
        data-gtm-trigger={SEARCH_PAGES_FORM_ID}
        id={SEARCH_PAGES_FORM_ID}
        onSubmit={event => {
          event.preventDefault();

          updateUrl(event.currentTarget);
        }}
      >
        <h1 className="visually-hidden">
          {capitalize(currentSearchCategory)} search
        </h1>

        {semanticSearchPrototype ? (
          <PrototypeSearchSelects
            currentQuery={queryValue}
            currentApiSelection={
              typeof router.query.searchIn === 'string'
                ? router.query.searchIn
                : 'all'
            }
          />
        ) : (
          <SearchBarContainer
            $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
          >
            <SearchBar
              variant="default"
              inputValue={inputValue}
              setInputValue={setInputValue}
              placeholder={
                currentSearchCategory === 'events'
                  ? 'Search for events and exhibitions'
                  : searchLabelText[currentSearchCategory]
              }
              form={SEARCH_PAGES_FORM_ID}
              location="search"
            />
          </SearchBarContainer>
        )}
      </form>
      {!semanticSearchPrototype && !semanticSearchComparison && (
        <TabsBorder $visible={true}>
          <Tabs
            tabBehaviour="navigate"
            hideBorder={true}
            label="Search Categories"
            items={tabItems}
            currentSection={currentSearchCategory}
          />
        </TabsBorder>
      )}
    </>
  );
};

export default SearchNavigation;
