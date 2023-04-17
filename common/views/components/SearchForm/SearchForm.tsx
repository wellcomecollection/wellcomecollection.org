import { useRouter } from 'next/router';
import { capitalize } from '@weco/common/utils/grammar';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar';
import {
  getUrlQueryFromSortValue,
  linkResolver,
  getQueryPropertyValue,
} from '@weco/common/utils/search';
import { useState, useEffect, ReactElement } from 'react';
import styled from 'styled-components';
import { trackGaEvent } from '@weco/common/utils/ga';
import Space from '@weco/common/views/components/styled/Space';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';

const SearchBarContainer = styled(Space)`
  ${props => props.theme.media('medium', 'max-width')`
    margin-bottom:0;
  `}
`;
// TODO if on /collections can't use router push - how does the header search take care of this
const updateUrl = (form: HTMLFormElement, router) => {
  const formValues = formDataAsUrlQuery(form);

  const sortOptionValue = getQueryPropertyValue(formValues.sortOrder);
  const urlFormattedSort = sortOptionValue
    ? getUrlQueryFromSortValue(sortOptionValue)
    : undefined;

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

  return router.push(link.href, link.as);
};

// TODO get it working on /collections
const SearchForm = (): ReactElement => {
  const router = useRouter();
  const currentSearchCategory =
    router.pathname === '/search'
      ? 'overview'
      : router.pathname.slice(router.pathname.lastIndexOf('/') + 1);
  const queryString = getQueryPropertyValue(router?.query?.query);
  const [inputValue, setInputValue] = useState(queryString || '');
  const searchbarPlaceholderText = {
    overview: 'Search our stories, images and catalogue',
    stories: 'Search for stories',
    images: 'Search for images',
    works: 'Search the catalogue',
  };
  /// //////////

  useEffect(() => {
    setInputValue(queryString || ''); // This accounts for queries done on these pages, but from the global search
  }, [currentSearchCategory, queryString]);

  return (
    <form
      role="search"
      id="search-page-form"
      onSubmit={event => {
        event.preventDefault();

        trackGaEvent({
          category: 'SearchForm',
          action: 'submit search',
          label: router.query.query as string,
        });

        updateUrl(event.currentTarget, router);
      }}
    >
      <h1 className="visually-hidden">
        {`${capitalize(currentSearchCategory)} search`}
      </h1>

      <SearchBarContainer
        v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
      >
        <SearchBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder={searchbarPlaceholderText[currentSearchCategory]}
          form="search-page-form"
          location="search"
        />
      </SearchBarContainer>
    </form>
  );
};

SearchForm.displayName = 'SearchForm';

export default SearchForm;
