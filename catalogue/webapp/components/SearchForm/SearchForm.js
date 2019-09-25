// @flow
import { useRef, useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import {
  type SearchParams,
  defaultWorkTypes,
} from '@weco/common/services/catalogue/search-params';
import FilterDrawerRefine from '@weco/common/views/components/FilterDrawerRefine/FilterDrawerRefine';

type Props = {|
  ariaDescribedBy: string,
  compact: boolean,
  shouldShowFilters: boolean,
  searchParams: SearchParams,
|};

const SearchInputWrapper = styled.div`
  background: ${props => props.theme.colors.white};
  margin-right: ${props => 8 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    margin-right: ${props => 10 * props.theme.spacingUnit}px;
  `}

  input[type="text"] {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div`
  height: ${props => 10 * props.theme.spacingUnit}px;
  top: 0;
  right: 0;
  width: ${props => 8 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    width: ${props => 10 * props.theme.spacingUnit}px;
  `}
`;

const ClearSearch = styled.button`
  right: 12px;
`;

const SearchForm = ({
  ariaDescribedBy,
  compact,
  shouldShowFilters,
  searchParams,
}: Props) => {
  const { query, workType } = searchParams;
  const searchForm = useRef();
  const getForm = () => searchForm;
  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const searchInput = useRef(null);

  // We need to make sure that the changes to `query` affect `inputQuery` as
  // when we navigate between pages which all contain `SearchForm`, each
  // instance of that component maintains it's own state so they go out of sync.
  // TODO: Think about if this is worth it.
  useEffect(() => {
    if (query !== inputQuery) {
      setInputQuery(query);
    }
  }, [query]);

  function updateUrl(unfilteredSearchResults, form) {
    const workType = searchParams.workType || [];
    const link = unfilteredSearchResults
      ? worksUrl({
          ...searchParams,
          // Override the defaultWorkType with [] if we're toggled to do so
          // null => default filters
          // [] => no filter
          // [anything] => filter
          workType: workType.length === defaultWorkTypes.length ? [] : workType,
          query: inputQuery,
          page: 1,
          // $FlowFixMe
          productionDatesFrom: form.current.productionDatesFrom
            ? form.current.productionDatesFrom.value
            : searchParams.productionDatesFrom,
          // $FlowFixMe
          productionDatesTo: form.current.productionDatesTo
            ? form.current.productionDatesTo.value
            : searchParams.productionDatesTo,
        })
      : worksUrl({
          ...searchParams,
          query: inputQuery,
          page: 1,
          // $FlowFixMe
          productionDatesFrom: form.current.productionDatesFrom
            ? form.current.productionDatesFrom.value
            : searchParams.productionDatesFrom,
          // $FlowFixMe
          productionDatesTo: form.current.productionDatesTo
            ? form.current.productionDatesTo.value
            : searchParams.productionDatesTo,
        });

    Router.push(link.href, link.as);
  }

  return (
    <TogglesContext.Consumer>
      {({ unfilteredSearchResults }) => (
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

            updateUrl(unfilteredSearchResults, searchForm);

            return false;
          }}
        >
          <SearchInputWrapper className="relative">
            <TextInput
              label={'Search the catalogue'}
              placeholder={'Search for books and pictures'}
              name="query"
              value={inputQuery}
              autoFocus={inputQuery === ''}
              onChange={event => setInputQuery(event.currentTarget.value)}
              ref={searchInput}
              required
              className={classNames({
                [font('hnl', compact ? 4 : 3)]: true,
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

          {workType && (
            <input type="hidden" name="workType" value={workType.join(',')} />
          )}

          {shouldShowFilters && (
            <FilterDrawerRefine getForm={getForm} searchParams={searchParams} />
          )}
          <SearchButtonWrapper className="absolute bg-green">
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
      )}
    </TogglesContext.Consumer>
  );
};
export default SearchForm;
