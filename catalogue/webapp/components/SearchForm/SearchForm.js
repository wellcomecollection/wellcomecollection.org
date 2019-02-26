// @flow
import { useState, useRef } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';

type Props = {|
  initialQuery: string,
  initialWorkType: string[],
  initialItemsLocationsLocationType: string[],
  ariaDescribedBy: string,
  compact: boolean,
  showFilters: boolean,
  reactiveFilters: boolean,
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

type SearchTagProps = {
  label: string,
  name: string,
  value: string,
  checked: boolean,
  onChange: (event: SyntheticEvent<HTMLInputElement>) => void,
};

const SearchTag = ({
  label,
  name,
  value,
  checked,
  onChange,
}: SearchTagProps) => {
  return (
    <label
      className={classNames({
        'flex-inline': true,
        'flex--v-center': true,
        pointer: true,
        [spacing(
          { s: 1 },
          { padding: ['left', 'right'], margin: ['left'] }
        )]: true,
      })}
      style={{ borderRadius: '3px', textDecoration: 'underline' }}
    >
      <div
        className={classNames({
          flex: true,
          'flex--v-center': true,
        })}
      >
        <input
          className={classNames({
            input: true,
            'input--checkbox': true,
            [font({ s: 'HNL3' })]: true,
          })}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <span
          className={classNames({
            'input__control-indicator': true,
            'input__control-indicator--checkbox': true,
            [spacing({ s: 1 }, { margin: ['right'] })]: true,
          })}
        />
        <span
          className={classNames({
            [font({ s: 'HNL4' })]: true,
          })}
        >
          {label}
        </span>
      </div>
    </label>
  );
};

const SearchForm = ({
  initialQuery = '',
  initialWorkType = [],
  initialItemsLocationsLocationType = [],
  ariaDescribedBy,
  compact,
  // This only works in conjunction with the toggle
  showFilters,
  reactiveFilters,
}: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [workType, setWorkType] = useState(initialWorkType);
  const [itemsLocationsLocationType] = useState(
    initialItemsLocationsLocationType
  );
  const searchInput = useRef(null);

  return (
    <TogglesContext.Consumer>
      {({ showCatalogueSearchFacets }) => (
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
                query,
                workType: showCatalogueSearchFacets ? [] : workType,
                itemsLocationsLocationType,
                page: 1,
              });

              Router.push(link.href, link.as);

              return false;
            }}
          >
            <div className="relative">
              <SearchInputWrapper className="relative">
                <TextInput
                  label={'Search the catalogue'}
                  placeholder={'Search for artworks, photos and more'}
                  name="query"
                  value={query}
                  autoFocus={query === ''}
                  onChange={event => setQuery(event.currentTarget.value)}
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

                      setQuery('');

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
                    <Icon
                      name="search"
                      title="Search"
                      extraClasses="icon--white"
                    />
                  </span>
                </button>
              </SearchButtonWrapper>
            </div>
          </form>
          <TogglesContext.Consumer>
            {({ showCatalogueSearchFilters, feedback }) =>
              (showCatalogueSearchFilters || feedback) && (
                <div
                  className={classNames({
                    [spacing({ s: 1 }, { margin: ['top'] })]: true,
                  })}
                >
                  {feedback && (
                    <p
                      className={classNames({
                        [font({ s: 'HNL4' })]: true,
                        relative: true,
                        [spacing({ s: 2 }, { margin: ['right'] })]: true,
                        [spacing({ s: 0 }, { margin: ['bottom'] })]: true,
                      })}
                      style={{
                        left: '1px',
                        flexGrow: 1,
                      }}
                    >
                      Our search is currently in beta.{' '}
                      <a href="https://www.surveymonkey.co.uk/r/W3NBWV2">
                        Let us know what you think
                      </a>
                    </p>
                  )}
                  {showCatalogueSearchFilters && showFilters && (
                    <fieldset
                      className={classNames({
                        relative: true,
                      })}
                      style={{
                        left: '1px',
                      }}
                    >
                      <div className={classNames({ flex: true })}>
                        <legend
                          className={classNames({
                            'float-l': true,
                            [font({ s: 'HNM4' })]: true,
                          })}
                        >
                          Filter by
                        </legend>
                        <div>
                          <SearchTag
                            name={'workType'}
                            label="Books"
                            value="a"
                            checked={workType.indexOf('a') !== -1}
                            onChange={event => {
                              const input = event.currentTarget;
                              const newWorkType = input.checked
                                ? [...workType, 'a']
                                : workType.filter(val => val !== 'a');

                              setWorkType(newWorkType);

                              if (reactiveFilters && query !== '') {
                                const link = worksUrl({
                                  query,
                                  workType: showCatalogueSearchFacets
                                    ? []
                                    : newWorkType,
                                  itemsLocationsLocationType,
                                  page: 1,
                                });

                                Router.push(link.href, link.as);
                              }
                            }}
                          />
                          <SearchTag
                            name={'workType'}
                            label="Pictures"
                            value="k"
                            checked={workType.indexOf('k') !== -1}
                            onChange={event => {
                              const input = event.currentTarget;
                              const newWorkType = input.checked
                                ? [...workType, 'k']
                                : workType.filter(val => val !== 'k');

                              setWorkType(newWorkType);

                              if (reactiveFilters && query !== '') {
                                const link = worksUrl({
                                  query,
                                  workType: showCatalogueSearchFacets
                                    ? []
                                    : newWorkType,
                                  itemsLocationsLocationType,
                                  page: 1,
                                });

                                Router.push(link.href, link.as);
                              }
                            }}
                          />
                          <SearchTag
                            name={'workType'}
                            label="Digital images"
                            value="q"
                            checked={workType.indexOf('q') !== -1}
                            onChange={event => {
                              const input = event.currentTarget;
                              const newWorkType = input.checked
                                ? [...workType, 'q']
                                : workType.filter(val => val !== 'q');

                              setWorkType(newWorkType);

                              if (reactiveFilters && query !== '') {
                                const link = worksUrl({
                                  query,
                                  workType: showCatalogueSearchFacets
                                    ? []
                                    : newWorkType,
                                  itemsLocationsLocationType,
                                  page: 1,
                                });

                                Router.push(link.href, link.as);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}
                </div>
              )
            }
          </TogglesContext.Consumer>
        </>
      )}
    </TogglesContext.Consumer>
  );
};
export default SearchForm;
