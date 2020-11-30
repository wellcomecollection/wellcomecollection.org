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
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { inputValue, nodeListValueToArray } from '@weco/common/utils/forms';
import SearchFilters from '@weco/common/views/components/PrototypeSearchFilters/PrototypeSearchFilters';
import Select from '@weco/common/views/components/Select/Select';
import Space from '@weco/common/views/components/styled/Space';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import SelectUncontrolled from '@weco/common/views/components/SelectUncontrolled/SelectUncontrolled';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import {
  WorksRouteProps,
  ImagesRouteProps,
  worksLink,
  imagesLink,
} from '@weco/common/services/catalogue/ts_routes';
import PrototypePortal from '../PrototypePortal/PrototypePortal';
import { AppContext } from '../AppContext/AppContext';

type Props = {
  ariaDescribedBy: string;
  routeProps: WorksRouteProps | ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  aggregations: CatalogueAggregations | null;
  isImageSearch: boolean;
  shouldShowFilters: boolean;
  showSortBy: boolean;
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

const PrototypeSearchForm: FunctionComponent<Props> = ({
  ariaDescribedBy,
  routeProps,
  workTypeAggregations,
  aggregations,
  isImageSearch,
  shouldShowFilters,
  showSortBy,
}: Props): ReactElement<Props> => {
  const [, setSearchParamsState] = useSavedSearchState(routeProps);
  const { query } = routeProps;
  const { isEnhanced } = useContext(AppContext);
  const searchForm = useRef<HTMLFormElement>(null);
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const searchInput = useRef<HTMLInputElement>(null);
  const [forceState, setForceState] = useState(false);
  const [portalSortOrder, setPortalSortOrder] = useState(routeProps.sortOrder);
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
    if (portalSortOrder !== routeProps.sortOrder) {
      submit();
    }
  }, [portalSortOrder]);

  function updateUrl(form: HTMLFormElement) {
    const workTypeCheckboxes = nodeListValueToArray(form['workType']) || [];
    const selectedWorkTypesArray = [...workTypeCheckboxes].filter(
      selectedWorkType => selectedWorkType.checked
    );
    const workType =
      selectedWorkTypesArray.length > 0
        ? selectedWorkTypesArray.map(workType => workType.value)
        : [];

    const sortOrder = portalSortOrder;
    const sort =
      sortOrder === 'asc' || sortOrder === 'desc' ? 'production.dates' : null;
    const search = inputValue(form['search']);
    const imagesColorValue = inputValue(form['images.color']);
    const imagesColor =
      typeof imagesColorValue === 'string'
        ? imagesColorValue.replace('#', '')
        : imagesColorValue;

    const itemsLocationsLocationType =
      form['items.locations.locationType'] instanceof window.HTMLInputElement
        ? form['items.locations.locationType'].checked
          ? form['items.locations.locationType'].value.split(',')
          : []
        : [];

    // Location type
    const itemsLocationsType = (
      nodeListValueToArray(form['items.locations.type']) || []
    )
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    const source = `search_form`;
    const state = {
      query: inputQuery,
      workType,
      page: 1,
      productionDatesFrom: inputValue(form['production.dates.from']),
      productionDatesTo: inputValue(form['production.dates.to']),
      imagesColor,
      sortOrder,
      sort,
      search,
      itemsLocationsLocationType,
      itemsLocationsType,
      source,
      color: null,
    };
    const link = isImageSearch
      ? imagesLink(
          {
            ...state,
            color: imagesColor,
            locationsLicense: null,
            sortOrder: null,
            sort: null,
          },
          source
        )
      : worksLink(state, source);
    setSearchParamsState(state);

    return Router.push(link.href, link.as);
  }

  return (
    <form
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
            type={null}
            pattern={null}
            errorMessage={null}
            placeholder={''}
            isValid={null}
            setIsValid={null}
            showValidity={null}
            setShowValidity={null}
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
          searchForm={searchForm}
          worksRouteProps={routeProps}
          workTypeAggregations={workTypeAggregations}
          changeHandler={submit}
          aggregations={aggregations}
          filtersToShow={
            isImageSearch ? ['colors'] : ['dates', 'formats', 'locations']
          }
        />
      )}
      {!isImageSearch && isEnhanced && (
        <PrototypePortal id="sort-select-portal">
          <Select
            name="portalSortOrder"
            label="Sort by"
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
        </PrototypePortal>
      )}
      <noscript>
        {!isImageSearch && showSortBy && (
          <>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <SelectUncontrolled
                name="sort"
                label="Sort by"
                defaultValue={routeProps.sort || ''}
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
              defaultValue={routeProps.sortOrder || ''}
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
export default PrototypeSearchForm;
