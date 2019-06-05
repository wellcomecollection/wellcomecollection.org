// @flow
import { useRef, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import CatalogueSearchContext from '@weco/common/views/components/CatalogueSearchContext/CatalogueSearchContext';

type Props = {|
  ariaDescribedBy: string,
  compact: boolean,
|};

const SearchInputWrapper = styled.div`
  background: ${props => props.theme.colors.white};
  margin-right: ${props => 8 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    margin-right: ${props => 10 * props.theme.spacingUnit}px;
  `}
`;

const SearchButtonWrapper = styled.div`
  height: 100%;
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

const SearchForm = ({ ariaDescribedBy, compact }: Props) => {
  const { query, workType, _queryType, setQueryType } = useContext(
    CatalogueSearchContext
  );

  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const searchInput = useRef(null);

  const [showBoosters, setShowBoosters] = useState(false);

  // We need to make sure that the changes to `query` affect `inputQuery` as
  // when we navigate between pages which all contain `SearchForm`, each
  // instance of that component maintains it's own state so they go out of sync.
  // TODO: Think about if this is worth it.
  useEffect(() => {
    if (query !== inputQuery) {
      setInputQuery(query);
    }
  }, [query]);

  return (
    <>
      <form
        action="/works"
        aria-describedby={ariaDescribedBy}
        onSubmit={event => {
          event.preventDefault();

          trackEvent({
            category: 'SearchForm',
            action: 'submit search',
            label: query,
          });

          const link = worksUrl({
            query: inputQuery,
            workType,
            page: 1,
            _queryType,
          });

          Router.push(link.href, link.as);

          return false;
        }}
      >
        <div className="relative">
          <SearchInputWrapper className="relative">
            <TextInput
              label={'Search the catalogue'}
              placeholder={'Search for books and pictures'}
              name="query"
              value={inputQuery}
              autoFocus={inputQuery === ''}
              onChange={event => setInputQuery(event.currentTarget.value)}
              ref={searchInput}
              className={font({
                s: compact ? 'HNL4' : 'HNL3',
                m: compact ? 'HNL3' : 'HNL2',
              })}
            />

            {query && (
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

          <SearchButtonWrapper className="absolute bg-green">
            <button
              className={classNames({
                'full-width': true,
                'full-height': true,
                'line-height-1': true,
                'plain-button no-padding': true,
                [font({ s: 'HNL3', m: 'HNL2' })]: true,
              })}
            >
              <span className="visually-hidden">Search</span>
              <span className="flex flex--v-center flex--h-center">
                <Icon name="search" title="Search" extraClasses="icon--white" />
              </span>
            </button>
          </SearchButtonWrapper>
        </div>

        {workType && (
          <input type="hidden" name="workType" value={workType.join(',')} />
        )}
        <fieldset
          className={classNames({
            [spacing({ s: 2 }, { margin: ['top'] })]: true,
          })}
        >
          <legend
            className={classNames({
              [font({ s: 'HNM4' })]: true,
              'font-green': true,
              flex: true,
            })}
            onClick={() => setShowBoosters(!showBoosters)}
          >
            <Icon name="chevron" />
            Boosters 🚀
          </legend>
          <datalist id="tickmarks" style={{ display: 'none' }}>
            <option value="0" label="0%" />
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="4" />
            <option value="5" label="50%" />
            <option value="6" />
            <option value="7" />
            <option value="8" />
            <option value="9" />
            <option value="10" label="100%" />
          </datalist>
          {showBoosters && (
            <>
              <label>
                <div
                  className={classNames({
                    [font({ s: 'HNL5' })]: true,
                  })}
                >
                  Title
                </div>
                <input
                  type="range"
                  style={{ width: '100%' }}
                  list="tickmarks"
                  min="0"
                  max="10"
                  step="1"
                  value="9"
                />
              </label>
              <label>
                <div
                  className={classNames({
                    [font({ s: 'HNL5' })]: true,
                  })}
                >
                  Subjects
                </div>
                <input
                  type="range"
                  style={{ width: '100%' }}
                  list="tickmarks"
                  min="0"
                  max="10"
                  step="1"
                  value="8"
                />
              </label>
              <label>
                <div
                  className={classNames({
                    [font({ s: 'HNL5' })]: true,
                  })}
                >
                  Genres
                </div>
                <input
                  type="range"
                  style={{ width: '100%' }}
                  list="tickmarks"
                  min="0"
                  max="10"
                  step="1"
                  value="8"
                />
              </label>
              <label>
                <div
                  className={classNames({
                    [font({ s: 'HNL5' })]: true,
                  })}
                >
                  Description
                </div>
                <input
                  type="range"
                  style={{ width: '100%' }}
                  list="tickmarks"
                  min="0"
                  max="10"
                  step="1"
                  value="5"
                />
              </label>
              <label>
                <div
                  className={classNames({
                    [font({ s: 'HNL5' })]: true,
                  })}
                >
                  Contributors
                </div>
                <input
                  type="range"
                  style={{ width: '100%' }}
                  list="tickmarks"
                  min="0"
                  max="10"
                  step="1"
                  value="2"
                />
              </label>
            </>
          )}
        </fieldset>
        <TogglesContext.Consumer>
          {({ selectableQueries }) =>
            selectableQueries && (
              <label>
                Query type:{' '}
                <select
                  value={_queryType}
                  onChange={event => setQueryType(event.currentTarget.value)}
                >
                  <option value="">None</option>
                  <option value="boost">boost</option>
                  <option value="msm">msm</option>
                  <option value="msmboost">msmboost</option>
                </select>
              </label>
            )
          }
        </TogglesContext.Consumer>
      </form>
    </>
  );
};
export default SearchForm;
