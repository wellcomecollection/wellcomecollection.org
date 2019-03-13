// @flow
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { useRef, useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import SelectableTags from '@weco/common/views/components/SelectableTags/SelectableTags';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import SearchContext from '../SearchContext/SearchContext';

type Props = {|
  ariaDescribedBy: string,
  compact: boolean,
  works: ?CatalogueResultsList,
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

const SearchForm = ({ ariaDescribedBy, compact, works }: Props) => {
  const { query, setQuery, itemsLocationsLocationType, workType } = useContext(
    SearchContext
  );
  const searchInput = useRef(null);

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
            query,
            workType,
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
              placeholder={'Search for books and pictures'}
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
                <Icon name="search" title="Search" extraClasses="icon--white" />
              </span>
            </button>
          </SearchButtonWrapper>
        </div>
        {itemsLocationsLocationType && (
          <input
            type="hidden"
            name="items.locations.locationType"
            value={itemsLocationsLocationType.join(',')}
          />
        )}
        {workType && (
          <input type="hidden" name="workType" value={workType.join(',')} />
        )}
      </form>
      <TogglesContext.Consumer>
        {({ showCatalogueSearchFilters, feedback, tabbedNavOnSearchForm }) =>
          (showCatalogueSearchFilters || feedback || tabbedNavOnSearchForm) && (
            <div
              className={classNames({
                [spacing({ s: 1 }, { margin: ['top'] })]: true,
              })}
            >
              {tabbedNavOnSearchForm && works && (
                <TabNav
                  large={false}
                  items={[
                    {
                      text: 'All',
                      link: worksUrl({
                        query,
                        workType: undefined,
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !workType,
                    },
                    {
                      text: 'Books',
                      link: worksUrl({
                        query,
                        workType: ['a', 'v'],
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !!(
                        workType &&
                        (workType.indexOf('a') !== -1 &&
                          workType.indexOf('v') !== -1)
                      ),
                    },
                    {
                      text: 'Pictures',
                      link: worksUrl({
                        query,
                        workType: ['k', 'q'],
                        itemsLocationsLocationType,
                        page: 1,
                      }),
                      selected: !!(
                        workType &&
                        (workType.indexOf('k') !== -1 &&
                          workType.indexOf('q') !== -1)
                      ),
                    },
                  ]}
                />
              )}
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
              {showCatalogueSearchFilters && works && (
                <div
                  className={classNames({
                    relative: true,
                  })}
                  style={{
                    left: '1px',
                  }}
                >
                  <div
                    className={classNames({
                      'float-l': true,
                      [font({ s: 'HNM4' })]: true,
                      [spacing({ s: 1 }, { margin: ['right'] })]: true,
                    })}
                    style={{ marginTop: '3px' }}
                  >
                    Show:
                  </div>
                  <SelectableTags
                    tags={[
                      {
                        textParts: ['Books'],
                        linkAttributes: worksUrl({
                          query,
                          workType: workType
                            ? workType.indexOf('a') !== -1 ||
                              workType.indexOf('v') !== -1
                              ? workType.filter(v => !(v === 'a' || v === 'v'))
                              : [...workType, 'a', 'v']
                            : ['a', 'v'],
                          itemsLocationsLocationType,
                          page: 1,
                        }),
                        selected: !!(
                          workType &&
                          (workType.indexOf('a') !== -1 &&
                            workType.indexOf('v') !== -1)
                        ),
                      },
                      {
                        textParts: ['Visual'],
                        linkAttributes: worksUrl({
                          query,
                          workType: workType
                            ? workType.indexOf('k') !== -1 ||
                              workType.indexOf('q') !== -1
                              ? workType.filter(v => !(v === 'k' || v === 'q'))
                              : [...workType, 'k', 'q']
                            : ['k', 'q'],
                          itemsLocationsLocationType,
                          page: 1,
                        }),
                        selected: !!(
                          workType &&
                          (workType.indexOf('k') !== -1 &&
                            workType.indexOf('q') !== -1)
                        ),
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )
        }
      </TogglesContext.Consumer>
    </>
  );
};
export default SearchForm;
