import { useRouter } from 'next/router';
import { ReactElement, RefObject, useEffect, useState } from 'react';

import { searchLabelText } from '@weco/common/data/microcopy';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import { getQueryPropertyValue, linkResolver } from '@weco/common/utils/search';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import SearchBar, {
  ValidLocations,
} from '@weco/common/views/components/SearchBar';
import Space from '@weco/common/views/components/styled/Space';

type SearchCategory = 'overview' | 'works';

function formAction(searchCategory: SearchCategory) {
  switch (searchCategory) {
    case 'overview':
      return '/search';
    case 'works':
      return '/search/works';
    default:
      return '/search';
  }
}

type Props = {
  searchCategory?: SearchCategory;
  location?: ValidLocations;
  inputRef?: RefObject<HTMLInputElement | null> | undefined;
  isNew?: boolean;
  hasAvailableOnlineOnly?: boolean;
};

// This search form is used in the Header and also at the top of /collections and /works/{id} pages
// If it's at the top of /collections or /works/{id} we want to show '/search/works'
// otherwise we default to '/search'
const SearchForm = ({
  searchCategory = 'overview',
  location = 'header',
  inputRef,
  isNew,
  hasAvailableOnlineOnly,
}: Props): ReactElement => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const initialValue = routerQuery || '';
  const [inputValue, setInputValue] = useState(initialValue);
  const [checkboxIsSelected, setCheckboxIsSelected] = useState(false);

  useEffect(() => {
    setInputValue(location === 'header' ? '' : initialValue);
  }, [router?.pathname, router?.query]);

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);
    const link = linkResolver({
      params: formValues,
      pathname: formAction(searchCategory),
    });

    return router.push(link.href);
  };

  const formId = `search-form-${searchCategory}`;

  return (
    <form
      data-component="search-form"
      action={formAction(searchCategory)}
      id={formId}
      data-gtm-trigger={formId}
      onSubmit={event => {
        event.preventDefault();
        updateUrl(event.currentTarget);
      }}
    >
      <SearchBar
        variant={isNew ? 'new' : 'default'}
        inputValue={inputValue}
        setInputValue={setInputValue}
        form={formId}
        placeholder={
          isNew
            ? 'Search for books, artworks, images, videos, archives and more'
            : searchLabelText[searchCategory]
        }
        inputRef={inputRef}
        location={location}
      />

      {hasAvailableOnlineOnly && (
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          <CheckboxRadio
            id="isAvailableOnlineOnly"
            type="checkbox"
            text="Available online only"
            value="online"
            name="availabilities"
            checked={checkboxIsSelected}
            onChange={() => setCheckboxIsSelected(!checkboxIsSelected)}
            form={formId}
          />
        </Space>
      )}
    </form>
  );
};

SearchForm.displayName = 'SearchForm';

export default SearchForm;
