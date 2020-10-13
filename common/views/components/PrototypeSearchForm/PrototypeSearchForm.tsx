import { useRef, useState, useEffect } from 'react';
import useValidation from '@weco/common/hooks/useValidation';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { inputValue, nodeListValueToArray } from '@weco/common/utils/forms';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';
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

type Props = {
  ariaDescribedBy: string;
  shouldShowFilters: boolean;
  routeProps: WorksRouteProps | ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  aggregations?: CatalogueAggregations;
  isImageSearch: boolean;
};

const SearchInputWrapper = styled.div`
  font-size: 20px;
  background: ${props => props.theme.color('white')};
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
  top: 0;
  right: 0;
`;

const ClearSearch = styled.button`
  right: 12px;
`;

const PrototypeSearchForm = ({
  ariaDescribedBy,
  shouldShowFilters,
  routeProps,
  workTypeAggregations,
  aggregations,
  isImageSearch,
}: Props) => {
  const [, setSearchParamsState] = useSavedSearchState(routeProps);
  const { query } = routeProps;

  const searchForm = useRef(null);
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const [enhanced, setEnhanced] = useState(false);
  const searchInput = useRef(null);

  function submit() {
    searchForm.current &&
      searchForm.current.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );
  }

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
    setEnhanced(true);
  }, []);

  function updateUrl(form: HTMLFormElement) {
    const workTypeCheckboxes = nodeListValueToArray(form['workType']) || [];
    const selectedWorkTypesArray = [...workTypeCheckboxes].filter(
      selectedWorkType => selectedWorkType.checked
    );
    const workType =
      selectedWorkTypesArray.length > 0
        ? selectedWorkTypesArray.map(workType => workType.value)
        : [];

    const sortOrder = inputValue(form['sortOrder']);
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

    const source = `search_form/${search || 'works'}`;
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
    };
    const link = isImageSearch
      ? imagesLink({ ...state, locationsLicense: null, color: null }, source)
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
      <SearchInputWrapper className="relative">
        <TextInput
          id={'works-search-input'}
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
          {...useValidation()}
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
              searchInput?.current.focus();
            }}
            type="button"
          >
            <Icon name="clear" title="Clear" />
          </ClearSearch>
        )}
      </SearchInputWrapper>

      {shouldShowFilters && (
        <>
          <SearchFilters
            searchForm={searchForm}
            routeProps={routeProps}
            workTypeAggregations={workTypeAggregations}
            changeHandler={submit}
            aggregations={aggregations}
          />
          {enhanced && (
            <Select
              name="sortOrder"
              label="Sort by"
              value={routeProps.sortOrder || ''}
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
              onChange={submit}
            />
          )}
          <noscript>
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
          </noscript>
        </>
      )}
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
