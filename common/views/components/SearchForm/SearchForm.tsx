import {
  useRef,
  useState,
  useEffect,
  useContext,
  FunctionComponent,
  ReactElement,
} from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '../TextInput/TextInput';
import Icon from '../Icon/Icon';
import ButtonSolid from '../ButtonSolid/ButtonSolid';
import { classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import SearchFilters from '../SearchFilters/SearchFilters';
import Select from '../Select/Select';
import Space from '../styled/Space';
import SelectUncontrolled from '../SelectUncontrolled/SelectUncontrolled';
import SearchFormSortByPortal from '../SearchFormSortByPortal/SearchFormSortByPortal';
import { AppContext } from '../AppContext/AppContext';
import {
  searchFormInputCatalogue,
  searchFormInputImage,
} from '../../../text/arial-labels';
import { ParsedUrlQuery } from 'querystring';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';
import { formDataAsUrlQuery } from '../../../utils/forms';

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

const SearchInputWrapper = styled.div`
  font-size: 20px;
  margin-right: 80px;

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  top: ${props => props.theme.spacingUnits['3']}px;
  right: ${props => props.theme.spacingUnits['3']}px;

  ${props =>
    props.theme.media.medium`
    top: ${props.theme.spacingUnits['4']}px;
    right: ${props.theme.spacingUnits['4']}px;
  `}

  ${props =>
    props.theme.media.large`
    top: ${props.theme.spacingUnits['5']}px;
    right: ${props.theme.spacingUnits['5']}px;
  `}
`;

const ClearSearch = styled.button`
  right: 12px;
`;

const SearchSortOrderWrapper = styled.div`
  color: ${props => props.theme.color('black')};
`;

const SearchForm: FunctionComponent<Props> = ({
  query,
  sort,
  sortOrder,
  linkResolver,
  ariaDescribedBy,
  isImageSearch,
  shouldShowFilters,
  showSortBy,
  filters,
}: Props): ReactElement<Props> => {
  const { isEnhanced } = useContext(AppContext);
  const searchForm = useRef<HTMLFormElement>(null);
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const searchInput = useRef<HTMLInputElement>(null);
  const [forceState, setForceState] = useState(false);
  const [portalSortOrder, setPortalSortOrder] = useState(sortOrder);

  function submit() {
    searchForm.current &&
      searchForm.current.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );
  }

  useEffect(() => {
    // This has been added in as the rerendering of createPortal does not trigger
    // Manually force this to trigger to rerender so the createPortal gets created
    // The refresh or going to another page does not retrigger the createPortal call
    // This is referred inside the paginator component
    // Adhoc: Added set timeout for some reason allows it to work.
    setTimeout(() => {
      !forceState && setForceState(true);
    }, 0);
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
      <Space
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
      >
        <SearchInputWrapper className="relative">
          <TextInput
            id={`${isImageSearch ? 'images' : 'works'}-search-input`}
            label={isImageSearch ? 'Search for images' : 'Search the catalogue'}
            name="query"
            value={inputQuery}
            setValue={setInputQuery}
            autoFocus={inputQuery === ''}
            ref={searchInput}
            required={true}
            big={true}
            placeholder={''}
            ariaLabel={
              isImageSearch ? searchFormInputImage : searchFormInputCatalogue
            }
          />

          {inputQuery && (
            <ClearSearch
              className="absolute line-height-1 plain-button v-center no-padding"
              onClick={() => {
                trackEvent({
                  category: 'SearchForm',
                  action: 'clear search',
                  label: 'works-search',
                });

                setInputQuery('');
                searchInput?.current?.focus();
              }}
              type="button"
            >
              <Icon name="clear" title="Clear" />
            </ClearSearch>
          )}
        </SearchInputWrapper>
      </Space>
      {query && shouldShowFilters && (
        <SearchFilters
          query={query}
          linkResolver={linkResolver}
          searchForm={searchForm}
          changeHandler={submit}
          filters={filters}
        />
      )}
      {!isImageSearch && isEnhanced && (
        <SearchFormSortByPortal id="sort-select-portal">
          <SearchSortOrderWrapper>
            <Select
              name="portalSortOrder"
              label="Sort by:"
              value={portalSortOrder || ''}
              options={[
                {
                  value: '',
                  text: 'Relevance',
                },
                {
                  value: 'asc',
                  text: 'Oldest to newest',
                },
                {
                  value: 'desc',
                  text: 'Newest to oldest',
                },
              ]}
              onChange={event => {
                setPortalSortOrder(event.currentTarget.value);
              }}
            />
          </SearchSortOrderWrapper>
        </SearchFormSortByPortal>
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
                  {
                    value: '',
                    text: 'Relevance',
                  },
                  {
                    value: 'production.dates',
                    text: 'Production dates',
                  },
                ]}
              />
            </Space>
            <SelectUncontrolled
              name="sortOrder"
              label="Sort order"
              defaultValue={sortOrder || ''}
              options={[
                {
                  value: 'asc',
                  text: 'Ascending',
                },
                {
                  value: 'desc',
                  text: 'Descending',
                },
              ]}
            />
          </>
        )}
      </noscript>
      <SearchButtonWrapper>
        <ButtonSolid
          icon="search"
          text="search"
          isTextHidden={true}
          isBig={true}
        />
      </SearchButtonWrapper>
    </form>
  );
};
export default SearchForm;
