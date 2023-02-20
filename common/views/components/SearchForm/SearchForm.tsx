import {
  useRef,
  useState,
  useEffect,
  useContext,
  ReactElement,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { trackGaEvent } from '@weco/common/utils/ga';
import SearchFilters from '@weco/common/views/components/SearchFilters';
import Select from '@weco/common/views/components/Select/Select';
import Space from '@weco/common/views/components/styled/Space';
import SelectUncontrolled from '@weco/common/views/components/SelectUncontrolled/SelectUncontrolled';
import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { searchFormInputCatalogue } from '@weco/common/text/aria-labels';
import { LinkProps } from '@weco/common/model/link-props';
import { Filter } from '@weco/common/services/catalogue/filters';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';
import SortByPortal from './SearchForm.SortByPortal';

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

const SearchSortOrderWrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['margin-right'] },
})`
  color: ${props => props.theme.color('black')};
`;

type Props = {
  query: string;
  sort?: string;
  sortOrder?: string;
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
  ariaDescribedBy: string;
  isImageSearch: boolean;
  shouldShowFilters: boolean;
  showSortBy: boolean;
  filters: Filter[];
};

const SearchForm = forwardRef(
  (
    {
      query,
      sort,
      sortOrder,
      linkResolver,
      ariaDescribedBy,
      isImageSearch,
      shouldShowFilters,
      showSortBy,
      filters,
    }: Props,
    ref
  ): ReactElement<Props> => {
    const { isEnhanced } = useContext(AppContext);
    const searchForm = useRef<HTMLFormElement>(null);
    // This is the query used by the input, that is then eventually passed to the
    // Router
    const [inputQuery, setInputQuery] = useState(query);
    const searchInput = useRef<HTMLInputElement>(null);
    const [forceState, setForceState] = useState(false);
    const [portalSortOrder, setPortalSortOrder] = useState(sortOrder);

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

    useEffect(() => {
      if (portalSortOrder !== sortOrder) {
        submit();
      }
    }, [portalSortOrder]);

    function updateUrl(form: HTMLFormElement) {
      const urlQuery = formDataAsUrlQuery(form);

      // TODO: remove sortOrder
      // We do this as the JS form uses a portal, due to the control being
      // outside of the for to obtain this value.
      const sort =
        portalSortOrder === 'asc' || portalSortOrder === 'desc'
          ? 'production.dates'
          : undefined;

      const link = linkResolver({
        ...urlQuery,
        sortOrder: portalSortOrder,
        sort,
      });

      return Router.push(link.href, link.as);
    }

    return (
      <form
        role="search"
        ref={searchForm}
        className="relative"
        action="/search/works"
        aria-describedby={ariaDescribedBy}
        onSubmit={event => {
          event.preventDefault();

          trackGaEvent({
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
              id="works-search-input"
              label="Search the catalogue"
              name="query"
              value={inputQuery}
              setValue={setInputQuery}
              ref={searchInput}
              big={true}
              ariaLabel={searchFormInputCatalogue}
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
        {!isImageSearch && isEnhanced && (
          <SortByPortal id="sort-select-portal">
            <SearchSortOrderWrapper>
              <Select
                name="portalSortOrder"
                label="Sort by:"
                value={portalSortOrder || ''}
                options={[
                  { value: '', text: 'Relevance' },
                  { value: 'asc', text: 'Oldest to newest' },
                  { value: 'desc', text: 'Newest to oldest' },
                ]}
                onChange={event => {
                  setPortalSortOrder(event.currentTarget.value);
                }}
              />
            </SearchSortOrderWrapper>
          </SortByPortal>
        )}
        <noscript>
          {!isImageSearch && showSortBy && (
            <>
              <Space v={{ size: 's', properties: ['margin-bottom'] }}>
                <SelectUncontrolled
                  name="sort"
                  label="Sort by"
                  defaultValue={sort || ''}
                  options={[
                    { value: '', text: 'Relevance' },
                    { value: 'production.dates', text: 'Production dates' },
                  ]}
                />
              </Space>
              <SelectUncontrolled
                name="sortOrder"
                label="Sort order"
                defaultValue={sortOrder || ''}
                options={[
                  { value: 'asc', text: 'Ascending' },
                  { value: 'desc', text: 'Descending' },
                ]}
              />
            </>
          )}
        </noscript>
      </form>
    );
  }
);

export default SearchForm;
