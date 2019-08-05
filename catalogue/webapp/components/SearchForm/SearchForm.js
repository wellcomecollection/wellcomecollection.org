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
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';
import DateSlider from '@weco/catalogue/components/DateSlider/DateSlider';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import TabNav from '@weco/common/views/components/TabNav/TabNav';

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

// For search term "Darwin"
const twentyYearRange = [
  {
    from: '1780',
    to: '1800',
    results: 22,
  },
  {
    from: '1800',
    to: '1820',
    results: 14,
  },
  {
    from: '1820',
    to: '1840',
    results: 6,
  },
  {
    from: '1840',
    to: '1860',
    results: 7,
  },
  {
    from: '1860',
    to: '1880',
    results: 61,
  },
  {
    from: '1880',
    to: '1900',
    results: 66,
  },
  {
    from: '1900',
    to: '1920',
    results: 33,
  },
  {
    from: '1920',
    to: '1940',
    results: 11,
  },
  {
    from: '1940',
    to: '1960',
    results: 6,
  },
  {
    from: '1960',
    to: '1980',
    results: 8,
  },
  {
    from: '1980',
    to: '2000',
    results: 6,
  },
  {
    from: '2000',
    to: '2020',
    results: 3,
  },
];

const SearchForm = ({ ariaDescribedBy, compact }: Props) => {
  const {
    query,
    workType,
    _queryType,
    setQueryType,
    _dateFrom,
    _dateTo,
  } = useContext(CatalogueSearchContext);

  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const searchInput = useRef(null);
  const [inputDateFrom, setInputDateFrom] = useState(_dateFrom);
  const [inputDateTo, setInputDateTo] = useState(_dateTo);
  const [showSlider, setShowSlider] = useState(true);

  const dateRangeItems = twentyYearRange.map(range => {
    return {
      text: `${range.from}-${range.to} (${range.results})`,
      link: worksUrl({
        query,
        workType,
        page: 1,
        _dateFrom: range.from,
        _dateTo: range.to,
      }),
      selected: !!(
        _dateFrom &&
        _dateFrom === range.from &&
        _dateTo &&
        _dateTo === range.to
      ),
    };
  });

  const [showBoosters, setShowBoosters] = useState(false);

  // We need to make sure that the changes to `query` affect `inputQuery` as
  // when we navigate between pages which all contain `SearchForm`, each
  // instance of that component maintains it's own state so they go out of sync.
  // TODO: Think about if this is worth it.
  useEffect(() => {
    if (query !== inputQuery) {
      setInputQuery(query);
    }

    if (_dateFrom !== inputDateFrom) {
      setInputDateFrom(_dateFrom);
    }

    if (_dateTo !== inputDateTo) {
      setInputDateTo(_dateTo);
    }
  }, [query, _dateFrom, _dateTo]);

  useEffect(() => {
    if (inputDateFrom !== _dateFrom || inputDateTo !== _dateTo) {
      updateUrl();
    }
  }, [inputDateFrom, inputDateTo]);

  function updateUrl() {
    const link = worksUrl({
      query: inputQuery,
      workType,
      page: 1,
      _queryType,
      _dateFrom: inputDateFrom,
      _dateTo: inputDateTo,
    });

    typeof window !== 'undefined' && Router.push(link.href, link.as);
  }

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

          updateUrl();

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
              className={classNames({
                [font('hnl', compact ? 4 : 3)]: true,
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
                [font('hnl', 3)]: true,
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

        <TogglesContext.Consumer>
          {({
            showDatesPrototype,
            showDatesSliderPrototype,
            showDatesAggregatePrototype,
          }) => (
            <>
              {(showDatesPrototype || showDatesSliderPrototype) &&
                !showDatesAggregatePrototype && (
                  <VerticalSpace size="m" properties={['margin-top']}>
                    <div
                      style={{
                        display: showDatesSliderPrototype ? 'none' : 'block',
                      }}
                    >
                      <VerticalSpace size="s" properties={['margin-top']}>
                        <label>
                          from:{' '}
                          <input
                            value={inputDateFrom || ''}
                            onChange={event => {
                              setInputDateFrom(`${event.currentTarget.value}`);
                            }}
                            style={{ width: '8em', padding: '0.5em' }}
                          />
                        </label>{' '}
                        <label>
                          to:{' '}
                          <input
                            value={inputDateTo || ''}
                            onChange={event => {
                              setInputDateTo(`${event.currentTarget.value}`);
                            }}
                            style={{ width: '8em', padding: '0.5em' }}
                          />
                        </label>
                      </VerticalSpace>
                      <VerticalSpace size="m" properties={['margin-top']}>
                        <Button
                          type="primary"
                          text="Clear dates"
                          clickHandler={() => {
                            setInputDateFrom('');
                            setInputDateTo('');
                          }}
                        />
                      </VerticalSpace>
                    </div>
                    {showDatesSliderPrototype && !showDatesAggregatePrototype && (
                      <>
                        {showSlider && (
                          <DateSlider
                            startValues={{
                              to: inputDateTo,
                              from: inputDateFrom,
                            }}
                            updateFrom={setInputDateFrom}
                            updateTo={setInputDateTo}
                          />
                        )}
                        <button
                          type="button"
                          className="plain-button underline-on-hover no-visible-focus"
                          onClick={() => {
                            setShowSlider(!showSlider);
                            if (showSlider) {
                              setInputDateFrom('');
                              setInputDateTo('');
                            }
                          }}
                        >
                          {showSlider ? 'Clear dates' : 'Show date filter'}
                        </button>
                      </>
                    )}
                  </VerticalSpace>
                )}
              {showDatesAggregatePrototype &&
                (inputQuery && inputQuery.toLowerCase() === 'darwin') && (
                  <TabNav items={dateRangeItems} />
                )}
            </>
          )}
        </TogglesContext.Consumer>
      </form>
    </>
  );
};
export default SearchForm;
