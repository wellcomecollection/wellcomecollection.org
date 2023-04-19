import { useRouter } from 'next/router';
import SearchBar, {
  ValidLocations,
} from '@weco/common/views/components/SearchBar/SearchBar';
import { linkResolver, getQueryPropertyValue } from '@weco/common/utils/search';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import { useState, useRef, useEffect, useContext, ReactElement } from 'react';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';

type SearchCategory = 'all' | 'works';

function placeholderText(searchCategory: SearchCategory) {
  switch (searchCategory) {
    case 'all':
      return 'Search our stories, images and catalogue';
    case 'works':
      return 'Search our catalogue and images';
    default:
      return 'Search our stories, images and catalogue';
  }
}

function formAction(searchCategory: SearchCategory) {
  switch (searchCategory) {
    case 'all':
      return '/search';
    case 'works':
      return '/search/works';
    default:
      return '/search';
  }
}
// This search form is used in the Header and also at the top of /collections and /works/{id} pages
// If it's at the top of /collections or /works/{id} we want to show '/search/works'
// otherwise we default to '/search'
const SearchForm = ({
  searchCategory = 'all',
  location = 'header',
}: {
  searchCategory?: SearchCategory;
  location?: ValidLocations;
}): ReactElement => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const { link: searchLink } = useContext(SearchContext);
  const initialValue =
    routerQuery || searchLink.as.query?.query?.toString() || '';
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [router?.pathname, router?.query]);

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);
    const link = linkResolver({
      params: formValues,
      pathname: formAction(searchCategory),
    });

    return router.push(link.href, link.as);
  };
  return (
    <form
      action={formAction(searchCategory)}
      id={`search-form-${searchCategory}`}
      onSubmit={event => {
        event.preventDefault();
        updateUrl(event.currentTarget);
      }}
    >
      <SearchBar
        inputValue={inputValue}
        setInputValue={setInputValue}
        form={`search-form-${searchCategory}`}
        placeholder={placeholderText(searchCategory)}
        inputRef={inputRef}
        location={location}
      />
    </form>
  );
};

SearchForm.displayName = 'SearchForm';

export default SearchForm;
