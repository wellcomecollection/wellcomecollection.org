// @flow
import { useRef, useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import CatalogueSearchContext from '@weco/common/views/components/CatalogueSearchContext/CatalogueSearchContext';
import Space from '@weco/common/views/components/styled/Space';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import { capitalize } from '@weco/common/utils/grammar';

const workTypes = [
  {
    title: 'texts',
    materialTypes: [
      { title: 'books', letter: 'a' },
      { title: 'e-books', letter: 'v' },
      { title: 'manuscripts, asian', letter: 'b' },
      { title: 'e-manuscripts, asian', letter: 'x' },
      { title: 'journals', letter: 'd' },
      { title: 'e-journals', letter: 'j' },
      { title: 'student dissertations', letter: 'w' },
      { title: 'music', letter: 'c' },
    ],
  },
  {
    title: 'visuals',
    materialTypes: [
      { title: 'pictures', letter: 'k' },
      { title: 'digital images', letter: 'q' },
      { title: 'maps', letter: 'e' },
      { title: 'ephemera', letter: 'l' },
    ],
  },
  {
    title: 'media',
    materialTypes: [
      { title: 'e-videos', letter: 'f' },
      { title: 'e-sound', letter: 's' },
      { title: 'videorecording', letter: 'g' },
      { title: 'sound', letter: 'i' },
      { title: 'cinefilm', letter: 'n' },
    ],
  },
  {
    title: 'objects',
    materialTypes: [
      { title: '3D objects', letter: 'r' },
      { title: 'mixed materials', letter: 'p' },
      { title: 'CD-ROMs', letter: 'm' },
    ],
  },
];

export function subcategoriesForWorkType(title: string) {
  const category = workTypes.find(wt => wt.title === title);

  return (category && category.materialTypes) || [];
}

function doArraysOverlap(arr1, arr2) {
  return arr1.some(t => arr2.includes(t));
}

export function categoryTitleForWorkTypes(workTypesArray: any[]) {
  const category = categoryForWorkTypes(workTypesArray);

  return category ? category.title : '';
}

function categoryForWorkTypes(workTypesArray) {
  return workTypes.find(wt => {
    const wtLetters = wt.materialTypes.map(a => a.letter);

    return doArraysOverlap(wtLetters, workTypesArray);
  });
}

function updateWorkTypes(workType, subcategory, isFiltering) {
  const activeWorkType = workTypes.find(
    t => t.title === categoryTitleForWorkTypes(workType)
  );

  if (isFiltering) {
    // If you're filtering and about to remove the last filter,
    // we give you all the results for the category
    if (isLastFilterItem(workType, subcategory)) {
      return activeWorkType && activeWorkType.materialTypes.map(t => t.letter);
    }
    // Otherwise add/remove items to the array
    return workType.includes(subcategory.letter)
      ? workType.filter(t => t !== subcategory.letter)
      : workType.concat(subcategory.letter);
  }

  // Not yet filtering, just add the single subcategory
  return [subcategory.letter];
}

function isLastFilterItem(workType, subcategory) {
  return workType.length === 1 && workType.includes(subcategory.letter);
}

function lettersForParentCategory(workType) {
  const category = categoryForWorkTypes(workType);

  return category ? category.materialTypes.map(m => m.letter) : [];
}

const ProtoTag = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
}))`
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid ${props => props.theme.colors.green};
  background: ${props => (props.isActive ? props.theme.colors.green : '#fff')};
  color: ${props => (props.isActive ? '#fff' : '')};
  border-radius: 3px;
  transition: all 200ms ease;
  margin-right: 6px;
  margin-top: 6px;

  &:hover {
    background: ${props => props.theme.colors.green};
    color: #fff;
  }
`;
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
  const {
    query,
    workType,
    _queryType,
    setQueryType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
  } = useContext(CatalogueSearchContext);

  // This is the query used by the input, that is then eventually passed to the
  // Router
  const [inputQuery, setInputQuery] = useState(query);
  const [shouldShowFilters, setShouldShowFilters] = useState(false);
  const searchInput = useRef(null);
  const [inputDateFrom, setInputDateFrom] = useState(_dateFrom);
  const [inputDateTo, setInputDateTo] = useState(_dateTo);
  const [fakeIsAvailableOnline, setFakeIsAvailableOnline] = useState(false);
  const [fakeIsAvailableInLibrary, setFakeIsAvailableInLibrary] = useState(
    false
  );

  useEffect(() => {
    // FIXME: not any of this
    setShouldShowFilters(Boolean(Router.pathname === '/works' && query));
  });

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

  function updateUrl() {
    const link = worksUrl({
      query: inputQuery,
      workType,
      page: 1,
      _queryType,
      _dateFrom: inputDateFrom,
      _dateTo: inputDateTo,
      _isFilteringBySubcategory,
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

        {shouldShowFilters && (
          <>
            <TabNav
              items={[
                {
                  text: 'Everything',
                  link: worksUrl({
                    query,
                    workType: null,
                    page: 1,
                    _dateFrom,
                    _dateTo,
                  }),
                  selected: !workType,
                },
              ].concat(
                workTypes.map(t => {
                  return {
                    text: capitalize(t.title),
                    link: worksUrl({
                      query,
                      workType: t.materialTypes.map(m => m.letter),
                      page: 1,
                      _dateFrom,
                      _dateTo,
                    }),
                    selected:
                      !!workType &&
                      doArraysOverlap(
                        t.materialTypes.map(m => m.letter),
                        workType
                      ),
                  };
                })
              )}
            />
            {workType && (
              <>
                <span className={font('hnm', 5)}>Format </span>
                {subcategoriesForWorkType(
                  categoryTitleForWorkTypes(workType)
                ).map(subcategory => (
                  <NextLink
                    key={subcategory.title}
                    {...worksUrl({
                      query,
                      workType: updateWorkTypes(
                        workType,
                        subcategory,
                        _isFilteringBySubcategory
                      ),
                      page: 1,
                      _dateFrom,
                      _dateTo,
                      _isFilteringBySubcategory: isLastFilterItem(
                        workType,
                        subcategory
                      )
                        ? ''
                        : 'true',
                    })}
                  >
                    <a>
                      <ProtoTag
                        isActive={
                          _isFilteringBySubcategory &&
                          workType.includes(subcategory.letter)
                        }
                      >
                        {subcategory.title}
                      </ProtoTag>
                    </a>
                  </NextLink>
                ))}
                {_isFilteringBySubcategory && (
                  <NextLink
                    {...worksUrl({
                      query,
                      workType: lettersForParentCategory(workType),
                      page: 1,
                      _dateFrom,
                      _dateTo,
                    })}
                  >
                    <a className={font('hnm', 6)}>clear format filters</a>
                  </NextLink>
                )}
              </>
            )}
          </>
        )}

        <TogglesContext.Consumer>
          {({ showDatesPrototype }) => (
            <>
              {showDatesPrototype && shouldShowFilters && (
                <Space v={{ size: 'm', properties: ['margin-top'] }}>
                  <div
                    style={{
                      display: 'block',
                    }}
                  >
                    <Space v={{ size: 's', properties: ['margin-top'] }}>
                      <span className={font('hnm', 5)}>Between </span>
                      <label>
                        <span className="visually-hidden">from: </span>
                        <input
                          placeholder={'YYYY'}
                          value={inputDateFrom || ''}
                          onChange={event => {
                            setInputDateFrom(`${event.currentTarget.value}`);
                          }}
                          style={{
                            width: '3.3em',
                            padding: '0.3em',
                            border: '0',
                            borderBottom: '2px solid #333',
                            background: 'transparent',
                          }}
                        />
                      </label>{' '}
                      <span className={font('hnm', 5)}>and </span>
                      <label>
                        <span className={'visually-hidden'}>to: </span>
                        <input
                          placeholder={'YYYY'}
                          value={inputDateTo || ''}
                          onChange={event => {
                            setInputDateTo(`${event.currentTarget.value}`);
                          }}
                          style={{
                            width: '3.3em',
                            padding: '0.3em',
                            border: '0',
                            borderBottom: '2px solid #333',
                            background: 'transparent',
                          }}
                        />
                      </label>
                      <Space
                        as="span"
                        h={{ size: 'm', properties: ['margin-left'] }}
                      >
                        <button
                          className={'btn btn--tertiary font-hnm font-size-5'}
                        >
                          set dates
                        </button>
                      </Space>
                      {(_dateFrom || _dateTo) && (
                        <NextLink
                          {...worksUrl({
                            query,
                            workType,
                            page: 1,
                            _dateFrom: null,
                            _dateTo: null,
                            _isFilteringBySubcategory,
                          })}
                        >
                          <a
                            className={font('hnm', 6)}
                            style={{ marginLeft: '6px' }}
                          >
                            clear date filters
                          </a>
                        </NextLink>
                      )}
                    </Space>
                  </div>
                </Space>
              )}
            </>
          )}
        </TogglesContext.Consumer>
        {shouldShowFilters && (
          <div>
            <span className={font('hnm', 5)}>Availability: </span>
            <ProtoTag
              onClick={() => {
                setFakeIsAvailableOnline(!fakeIsAvailableOnline);
              }}
              isActive={fakeIsAvailableOnline}
              style={{ cursor: 'pointer' }}
            >
              Online
            </ProtoTag>
            <ProtoTag
              onClick={() => {
                setFakeIsAvailableInLibrary(!fakeIsAvailableInLibrary);
              }}
              isActive={fakeIsAvailableInLibrary}
              style={{ cursor: 'pointer' }}
            >
              In library
            </ProtoTag>
            {(fakeIsAvailableInLibrary || fakeIsAvailableOnline) && (
              <a
                onClick={() => {
                  setFakeIsAvailableOnline(false);
                  setFakeIsAvailableInLibrary(false);
                }}
                className={font('hnm', 6)}
                style={{ marginLeft: '6px', cursor: 'pointer' }}
              >
                clear availablity filters
              </a>
            )}
          </div>
        )}
      </form>
    </>
  );
};
export default SearchForm;
