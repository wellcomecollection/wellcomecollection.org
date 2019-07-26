// @flow
import { useRef, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import CatalogueSearchContext from '@weco/common/views/components/CatalogueSearchContext/CatalogueSearchContext';
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';

type Props = {|
  ariaDescribedBy: string,
  compact: boolean,
|};

const Tick = ({ tick, count }) => {
  // your own tick component
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: 52,
          marginLeft: -0.5,
          width: 1,
          height: 8,
          backgroundColor: 'silver',
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 60,
          fontSize: 10,
          textAlign: 'center',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {tick.value}
      </div>
    </div>
  );
};

const KeyboardHandle = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled,
  getHandleProps,
}) => {
  return (
    <button
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: 24,
        height: 24,
        borderRadius: '50%',
        boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
        backgroundColor: disabled ? '#666' : '#ffc400',
      }}
      {...getHandleProps(id)}
    />
  );
};

const Handle = ({ handle: { id, value, percent }, getHandleProps }) => {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
        {value}
      </div>
    </div>
  );
};

const Track = ({ source, target, getTrackProps }) => {
  // your own track component
  return (
    <div
      style={{
        position: 'absolute',
        height: 10,
        zIndex: 1,
        marginTop: 35,
        backgroundColor: '#546C91',
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
};

const sliderStyle = {
  // Give the slider some width
  position: 'relative',
  width: '100%',
  height: 80,
  border: '1px solid steelblue',
};

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
};

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

  function updateDateFrom(event) {
    setInputDateFrom(event.currentTarget.value);
  }

  function updateDateTo(event) {
    setInputDateTo(event.currentTarget.value);
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

          const link = worksUrl({
            query: inputQuery,
            workType,
            page: 1,
            _queryType,
            _dateFrom: inputDateFrom,
            _dateTo: inputDateTo,
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
          {({ showDatesPrototype }) => (
            <>
              {showDatesPrototype && (
                <VerticalSpace
                  as="details"
                  size="m"
                  properties={['margin-top']}
                >
                  <summary>Date range</summary>
                  <VerticalSpace size="s" properties={['margin-top']}>
                    <label>
                      from:{' '}
                      <input
                        value={inputDateFrom}
                        onChange={updateDateFrom}
                        placeholder="YYYY-MM-DD"
                        pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])"
                        style={{ width: '8em', padding: '0.5em' }}
                      />
                    </label>{' '}
                    <label>
                      to:{' '}
                      <input
                        value={inputDateTo}
                        onChange={updateDateTo}
                        placeholder="YYYY-MM-DD"
                        pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])"
                        style={{ width: '8em', padding: '0.5em' }}
                      />
                    </label>
                  </VerticalSpace>
                  <VerticalSpace>
                    <Slider
                      rootStyle={sliderStyle}
                      domain={[0, 2020]}
                      step={100}
                      mode={2}
                      values={[0, 2020]}
                    >
                      <div style={railStyle} />
                      <Rail>
                        {(
                          { getRailProps } // adding the rail props sets up events on the rail
                        ) => <div style={railStyle} {...getRailProps()} />}
                      </Rail>
                      <Handles>
                        {({ handles, getHandleProps }) => (
                          <div className="slider-handles">
                            {handles.map(handle => (
                              <>
                                <KeyboardHandle
                                  key={handle.id}
                                  handle={handle}
                                  domain={[0, 2020]}
                                  getHandleProps={getHandleProps}
                                  disabled={false}
                                />
                                <Handle
                                  key={handle.id}
                                  handle={handle}
                                  getHandleProps={getHandleProps}
                                />
                              </>
                            ))}
                          </div>
                        )}
                      </Handles>
                      <Tracks right={false}>
                        {({ tracks, getTrackProps }) => (
                          <div className="slider-tracks">
                            {tracks.map(({ id, source, target }) => (
                              <Track
                                key={id}
                                source={source}
                                target={target}
                                getTrackProps={getTrackProps}
                              />
                            ))}
                          </div>
                        )}
                      </Tracks>
                      <Ticks count={15}>
                        {({ ticks }) => (
                          <div className="slider-ticks">
                            {ticks.map(tick => (
                              <Tick
                                key={tick.id}
                                tick={tick}
                                count={ticks.length}
                              />
                            ))}
                          </div>
                        )}
                      </Ticks>
                    </Slider>
                  </VerticalSpace>
                </VerticalSpace>
              )}
            </>
          )}
        </TogglesContext.Consumer>
      </form>
    </>
  );
};
export default SearchForm;
