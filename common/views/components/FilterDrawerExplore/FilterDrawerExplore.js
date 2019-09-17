import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import TabNav from '../TabNav/TabNav';
import { worksUrl, searchQueryParams } from '../../../services/catalogue/urls';
import { capitalize } from '../../../utils/grammar';
import { font } from '../../../utils/classnames';
import ProtoTag from '../styled/ProtoTag';
import Space from '../styled/Space';

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

function subcategoriesForWorkType(title: string) {
  const category = workTypes.find(wt => wt.title === title);

  return (category && category.materialTypes) || [];
}

function doArraysOverlap(arr1, arr2) {
  return arr1.some(t => arr2.includes(t));
}

function categoryTitleForWorkTypes(workTypesArray: any[]) {
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

function FilterDrawerExplore() {
  const {
    query,
    workType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
  } = searchQueryParams();
  const [fakeIsAvailableOnline, setFakeIsAvailableOnline] = useState(false);
  const [fakeIsAvailableInLibrary, setFakeIsAvailableInLibrary] = useState(
    false
  );
  const [inputDateFrom, setInputDateFrom] = useState(_dateFrom);
  const [inputDateTo, setInputDateTo] = useState(_dateTo);

  useEffect(() => {
    if (_dateFrom !== inputDateFrom) {
      setInputDateFrom(_dateFrom);
    }

    if (_dateTo !== inputDateTo) {
      setInputDateTo(_dateTo);
    }
  }, [_dateFrom, _dateTo]);
  return (
    <Space v={{ size: 'm', properties: ['margin-top'] }}>
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
                doArraysOverlap(t.materialTypes.map(m => m.letter), workType),
            };
          })
        )}
      />
      {workType && (
        <Space
          v={{ size: 'm', properties: ['margin-top'] }}
          className="flex flex--v-center"
        >
          <span
            className={font('hnm', 5)}
            style={{ minWidth: '100px', display: 'inline-block' }}
          >
            Format{' '}
          </span>
          <div>
            {subcategoriesForWorkType(categoryTitleForWorkTypes(workType)).map(
              subcategory => (
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
                  <ProtoTag
                    as="a"
                    isActive={
                      _isFilteringBySubcategory &&
                      workType.includes(subcategory.letter)
                    }
                  >
                    {subcategory.title}
                  </ProtoTag>
                </NextLink>
              )
            )}
          </div>
        </Space>
      )}

      <Space v={{ size: 'm', properties: ['margin-top'] }}>
        <div
          style={{
            display: 'block',
          }}
        >
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <span
              className={font('hnm', 5)}
              style={{ minWidth: '100px', display: 'inline-block' }}
            >
              Between{' '}
            </span>
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
            <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
              <NextLink
                passHref
                {...worksUrl({
                  query,
                  workType,
                  page: 1,
                  _dateFrom: inputDateFrom,
                  _dateTo: inputDateTo,
                  _isFilteringBySubcategory,
                })}
              >
                <ProtoTag as="a">set dates</ProtoTag>
              </NextLink>
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
                <a className={font('hnm', 6)} style={{ marginLeft: '6px' }}>
                  clear date filters
                </a>
              </NextLink>
            )}
          </Space>
        </div>

        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <span
            className={font('hnm', 5)}
            style={{ minWidth: '100px', display: 'inline-block' }}
          >
            Availability{' '}
          </span>
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
        </Space>
      </Space>
      {(_isFilteringBySubcategory ||
        _dateFrom ||
        _dateTo ||
        fakeIsAvailableInLibrary ||
        fakeIsAvailableOnline) && (
        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType: null,
              page: 1,
              _dateFrom: null,
              _dateTo: null,
              _isFilteringBySubcategory: false,
            })}
          >
            <a
              className={font('hnm', 6)}
              onClick={() => {
                setFakeIsAvailableOnline(false);
                setFakeIsAvailableInLibrary(false);
              }}
            >
              clear all filters
            </a>
          </NextLink>
        </Space>
      )}
    </Space>
  );
}

export default FilterDrawerExplore;
