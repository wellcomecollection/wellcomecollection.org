import {
  useRef,
  useState,
  useEffect,
  ReactElement,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '../TextInput/TextInput';
import ButtonSolid from '../ButtonSolid/ButtonSolid';
import { trackEvent } from '../../../utils/ga';
import SearchFilters from '../SearchFilters/SearchFilters';
import Space from '../styled/Space';
import ClearSearch from '../ClearSearch/ClearSearch';
import {
  searchFormInputCatalogue,
  searchFormInputImage,
} from '../../../text/aria-labels';
import { ParsedUrlQuery } from 'querystring';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';
import { formDataAsUrlQuery } from '../../../utils/forms';
import { getUrlQueryFromSortValue } from '@weco/catalogue/utils/search';

const Wrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1 1 auto;

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div`
  margin-left: 4px;
  button {
    height: 100%;
  }
`;

type Props = {
  query: string;
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
  ariaDescribedBy: string;
  isImageSearch: boolean;
  shouldShowFilters: boolean;
  filters: Filter[];
};

const SearchForm = forwardRef(
  (
    {
      query,
      linkResolver,
      ariaDescribedBy,
      isImageSearch,
      shouldShowFilters,
      filters,
    }: Props,
    ref
  ): ReactElement<Props> => {
    const searchForm = useRef<HTMLFormElement>(null);
    // This is the query used by the input, that is then eventually passed to the
    // Router
    const [inputQuery, setInputQuery] = useState(query);
    const searchInput = useRef<HTMLInputElement>(null);
    const [forceState, setForceState] = useState(false);

    function submit() {
      // As of React 17, we need to make the event bubble to ensure the onSubmit of the form gets called
      // see: https://github.com/final-form/react-final-form/issues/878
      searchForm.current &&
        searchForm.current.dispatchEvent(
          new window.Event('submit', { cancelable: true, bubbles: true })
        );
    }

    useImperativeHandle(ref, () => ({
      submit,
    }));

    useEffect(() => {
      // This has been added in as the rerendering of createPortal does not trigger
      // Manually force this to trigger to rerender so the createPortal gets created
      // The refresh or going to another page does not retrigger the createPortal call
      // This is referred inside the paginator component
      // Adhoc: Added set timeout for some reason allows it to work.
      const delayTimer = setTimeout(() => {
        !forceState && setForceState(true);
      }, 0);
      return () => {
        clearTimeout(delayTimer);
      };
    }, []);

    // We need to make sure that the changes to `query` affect `inputQuery` as
    // when we navigate between pages which all contain `SearchForm`, each
    // instance of that component maintains it's own state so they go out of sync.
    // TODO: Think about if this is worth it.
    useEffect(() => {
      if (query !== inputQuery) {
        setInputQuery(query);
      }
    }, [query]);

    function updateUrl(form: HTMLFormElement) {
      const urlQuery = formDataAsUrlQuery(form);

      const sortOptionValue = urlQuery?.sortOrder
        ? Array.isArray(urlQuery.sortOrder)
          ? urlQuery.sortOrder[0]
          : urlQuery.sortOrder
        : '';

      const { sort, sortOrder } = getUrlQueryFromSortValue(sortOptionValue);

      const link = linkResolver({
        ...urlQuery,
        sortOrder,
        sort,
      });

      return Router.push(link.href, link.as);
    }

    return (
      <form
        role="search"
        id="worksSearchForm"
        ref={searchForm}
        className="relative"
        action={isImageSearch ? '/images' : '/works'}
        aria-describedby={ariaDescribedBy}
        onSubmit={event => {
          event.preventDefault();

          trackEvent({
            category: 'SearchForm',
            action: 'submit search',
            label: query,
          });

          updateUrl(event.currentTarget);
          return false;
        }}
      >
        <Wrapper>
          <SearchInputWrapper>
            <TextInput
              id={`${isImageSearch ? 'images' : 'works'}-search-input`}
              label={
                isImageSearch ? 'Search for images' : 'Search the catalogue'
              }
              name="query"
              value={inputQuery}
              setValue={setInputQuery}
              ref={searchInput}
              big={true}
              ariaLabel={
                isImageSearch ? searchFormInputImage : searchFormInputCatalogue
              }
            />

            {inputQuery && (
              <ClearSearch
                inputRef={searchInput}
                setValue={setInputQuery}
                gaEvent={{
                  category: 'SearchForm',
                  action: 'clear search',
                  label: 'works-search',
                }}
                right={10}
              />
            )}
          </SearchInputWrapper>
          <SearchButtonWrapper>
            <ButtonSolid text="Search" />
          </SearchButtonWrapper>
        </Wrapper>
        {shouldShowFilters && (
          <SearchFilters
            query={query}
            linkResolver={linkResolver}
            changeHandler={submit}
            filters={filters}
          />
        )}
      </form>
    );
  }
);

export default SearchForm;
