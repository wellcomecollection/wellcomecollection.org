// @flow
import RadioGroup from '@weco/common/views/components/RadioGroup/RadioGroup';
import { useRef, useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
// $FlowFixMe (tsx)
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { inputValue, nodeListValueToArray } from '@weco/common/utils/forms';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';
import Select from '@weco/common/views/components/Select/Select';
import Space from '@weco/common/views/components/styled/Space';
import {
  type CatalogueAggregationBucket,
  type CatalogueAggregations,
} from '@weco/common/model/catalogue';
import SelectUncontrolled from '@weco/common/views/components/SelectUncontrolled/SelectUncontrolled';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import {
  type WorksRouteProps,
  worksLink,
} from '@weco/common/services/catalogue/routes';

type Props = {|
  ariaDescribedBy: string,
  shouldShowFilters: boolean,
  worksRouteProps: WorksRouteProps,
  workTypeAggregations: CatalogueAggregationBucket[],
  placeholder?: string,
  aggregations?: CatalogueAggregations,
  ariaRoleForm?: string,
|};

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

const SearchForm = ({
  ariaDescribedBy,
  shouldShowFilters,
  worksRouteProps,
  workTypeAggregations,
  placeholder,
  aggregations,
  ariaRoleForm,
}: Props) => {
  const [, setSearchParamsState] = useSavedSearchState(worksRouteProps);
  const { query } = worksRouteProps;

  const searchForm = useRef();
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const searchInput = useRef();
  const submit = () => {
    searchForm.current &&
      searchForm.current.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );
  };

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

  useEffect(() => {
    setIsImageSearch(worksRouteProps.search);
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
    const link = worksLink(state, source);
    setSearchParamsState(state);

    return Router.push(link.href, link.as);
  }

  return (
    <form
      ref={searchForm}
      className="relative"
      action="/works"
      aria-describedby={ariaDescribedBy}
      role={ariaRoleForm}
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
          label={'Search the catalogue'}
          name="query"
          value={inputQuery}
          setValue={setInputQuery}
          autoFocus={inputQuery === ''}
          ref={searchInput}
          required={true}
          big={true}
          ariaLabel={'search input field'}
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
              searchInput.current && searchInput.current.focus();
            }}
            type="button"
          >
            <Icon name="clear" title="Clear" />
          </ClearSearch>
        )}
      </SearchInputWrapper>

      <Space
        v={{ size: 'm', properties: ['margin-top'] }}
        className={classNames({
          [font('hnl', 5)]: true,
        })}
      >
        <RadioGroup
          name="search"
          selected={isImageSearch ? 'images' : ''}
          onChange={value => {
            setIsImageSearch(value);
            inputQuery &&
              searchForm &&
              searchForm.current &&
              updateUrl(searchForm.current);
          }}
          options={[
            {
              id: 'all-collection',
              value: '',
              label: 'Library catalogue',
            },
            {
              id: 'images',
              value: 'images',
              label: 'Images',
            },
          ]}
        />
      </Space>

      {shouldShowFilters && (
        <>
          <SearchFilters
            searchForm={searchForm}
            worksRouteProps={worksRouteProps}
            workTypeAggregations={workTypeAggregations}
            changeHandler={submit}
            aggregations={aggregations}
          />
          {enhanced && (
            <Select
              name="sortOrder"
              label="Sort by"
              value={worksRouteProps.sortOrder || ''}
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
                submit();
              }}
            />
          )}
          <noscript>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <SelectUncontrolled
                name="sort"
                label="Sort by"
                defaultValue={worksRouteProps.sort || ''}
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
              defaultValue={worksRouteProps.sortOrder || ''}
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
export default SearchForm;
