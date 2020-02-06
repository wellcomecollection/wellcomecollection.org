// @flow
import RadioGroup from '@weco/common/views/components/RadioGroup/RadioGroup';
import { useRef, useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { inputValue, nodeListValueToArray } from '@weco/common/utils/forms';
import SearchFilters from '@weco/common/views/components/SearchFilters/SearchFilters';
import Select from '@weco/common/views/components/Select/Select';
import Space from '@weco/common/views/components/styled/Space';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';
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
  workTypeAggregations: ?(CatalogueAggregationBucket[]),
  placeholder?: string,
|};

const SearchInputWrapper = styled.div`
  background: ${props => props.theme.colors.white};
  margin-right: ${props => 12 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    margin-right: ${props => 16 * props.theme.spacingUnit}px;
  `}

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div`
  height: ${props => 10 * props.theme.spacingUnit}px;
  top: 0;
  right: 0;
  width: ${props => 10 * props.theme.spacingUnit}px;
  border: ${props => props.theme.borderRadiusUnit}px;

  ${props => props.theme.media.medium`
    width: ${props => 14 * props.theme.spacingUnit}px;
  `}
`;

const ClearSearch = styled.button`
  right: 12px;
`;

const SearchTypeRadioGroup = styled(RadioGroup)`
  margin-top: 30px;
`;

const SearchForm = ({
  ariaDescribedBy,
  shouldShowFilters,
  worksRouteProps,
  workTypeAggregations,
  placeholder,
}: Props) => {
  const [, setSearchParamsState] = useSavedSearchState(worksRouteProps);
  const { query } = worksRouteProps;

  const searchForm = useRef();
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
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

    const itemsLocationsLocationType =
      form['items.locations.locationType'] instanceof window.HTMLInputElement
        ? form['items.locations.locationType'].checked
          ? form['items.locations.locationType'].value.split(',')
          : []
        : [];

    const state = {
      query: inputQuery,
      workType,
      page: 1,
      productionDatesFrom: inputValue(form['production.dates.from']),
      productionDatesTo: inputValue(form['production.dates.to']),
      sortOrder,
      sort,
      search,
      itemsLocationsLocationType,
    };
    const link = worksLink(state);
    setSearchParamsState(state);

    return Router.push(link.href, link.as);
  }

  return (
    <form
      ref={searchForm}
      className="relative"
      action="/works"
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
          label={'Search the catalogue'}
          placeholder={placeholder || 'Search for books and pictures'}
          name="query"
          value={inputQuery}
          autoFocus={inputQuery === ''}
          onChange={event => setInputQuery(event.currentTarget.value)}
          ref={searchInput}
          required
          className={classNames({
            [font('hnm', 3)]: true,
            'search-query': true,
          })}
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
              // $FlowFixMe
              searchInput.current && searchInput.current.focus();
            }}
            type="button"
          >
            <Icon name="clear" title="Clear" />
          </ClearSearch>
        )}
      </SearchInputWrapper>

      {shouldShowFilters && (
        <>
          <SearchTypeRadioGroup
            name="search"
            selected={worksRouteProps.search ? 'images' : ''}
            onChange={() => {
              searchForm.current && updateUrl(searchForm.current);
            }}
            options={[
              {
                id: 'all-collection',
                value: '',
                label: 'All collection',
              },
              {
                id: 'images',
                value: 'images',
                label: 'Images only',
              },
            ]}
          />
          <SearchFilters
            searchForm={searchForm}
            worksRouteProps={worksRouteProps}
            workTypeAggregations={workTypeAggregations}
            changeHandler={submit}
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
      <SearchButtonWrapper className="absolute bg-green rounded-corners">
        <button
          className={classNames({
            'full-width': true,
            'full-height': true,
            'line-height-1': true,
            'plain-button no-padding': true,
            [font('hnl', 3)]: true,
          })}
        >
          <span className="visually-hidden">Search</span>
          <span className="flex flex--v-center flex--h-center">
            <Icon name="search" title="Search" extraClasses="icon--white" />
          </span>
        </button>
      </SearchButtonWrapper>
    </form>
  );
};
export default SearchForm;
