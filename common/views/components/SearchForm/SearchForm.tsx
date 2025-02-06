import { useRouter } from 'next/router';
import {
  ReactElement,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';

import { searchLabelText } from '@weco/common/data/microcopy';
import { useToggles } from '@weco/common/server-data/Context';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import { getQueryPropertyValue, linkResolver } from '@weco/common/utils/search';
import SearchBar, {
  ValidLocations,
} from '@weco/common/views/components/SearchBar/SearchBar';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';

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
// This search form is used in the Header and also at the top of /collections and /works/{id} pages
// If it's at the top of /collections or /works/{id} we want to show '/search/works'
// otherwise we default to '/search'
const SearchForm = ({
  searchCategory = 'overview',
  location = 'header',
  inputRef = undefined,
}: {
  searchCategory?: SearchCategory;
  location?: ValidLocations;
  inputRef?: RefObject<HTMLInputElement> | undefined;
}): ReactElement => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const { link: searchLink } = useContext(SearchContext);
  const { allSearch } = useToggles();
  const initialValue =
    routerQuery || searchLink.as.query?.query?.toString() || '';
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(location === 'header' ? '' : initialValue);
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
        placeholder={
          searchLabelText[
            searchCategory !== 'overview'
              ? searchCategory
              : allSearch
                ? 'overviewAllSearch'
                : 'overview'
          ]
        }
        inputRef={inputRef}
        location={location}
      />
    </form>
  );
};

SearchForm.displayName = 'SearchForm';

export default SearchForm;
