import { useContext, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { worksUrl } from '../../../services/catalogue/urls';
import { font } from '../../../utils/classnames';
import ProtoTag from '../styled/ProtoTag';
import Space from '../styled/Space';
import CatalogueSearchContext from '../CatalogueSearchContext/CatalogueSearchContext';
import Icon from '../Icon/Icon';

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

const allWorkTypes = workTypes
  .map(t => t.materialTypes)
  .reduce((acc, curr) => acc.concat(curr), []);

function updateWorkTypes(workType, subcategory, isFiltering) {
  if (isFiltering) {
    // If you're filtering and about to remove the last filter,
    // we give you all the results for the category
    if (isLastFilterItem(workType, subcategory)) return null;

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

function FilterDrawer() {
  const {
    query,
    workType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
  } = useContext(CatalogueSearchContext);
  const [fakeIsAvailableOnline, setFakeIsAvailableOnline] = useState(false);
  const [fakeIsAvailableInLibrary, setFakeIsAvailableInLibrary] = useState(
    false
  );
  const [inputDateFrom, setInputDateFrom] = useState(_dateFrom);
  const [inputDateTo, setInputDateTo] = useState(_dateTo);
  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    if (_dateFrom !== inputDateFrom) {
      setInputDateFrom(_dateFrom);
    }

    if (_dateTo !== inputDateTo) {
      setInputDateTo(_dateTo);
    }
  }, [_dateFrom, _dateTo]);

  return (
    <div>
      <Space
        v={{
          size: 'm',
          properties: ['margin-top', 'margin-bottom'],
        }}
      >
        <ProtoTag
          as="button"
          type="button"
          isActive={activeDrawer === 'date'}
          onClick={() => {
            setActiveDrawer(activeDrawer === 'date' ? null : 'date');
          }}
        >
          <Icon name="chevron" />
          Dates
        </ProtoTag>
        <ProtoTag
          as="button"
          type="button"
          isActive={activeDrawer === 'format'}
          onClick={() => {
            setActiveDrawer(activeDrawer === 'format' ? null : 'format');
          }}
        >
          <Icon name="chevron" />
          Formats
        </ProtoTag>
        <ProtoTag
          as="button"
          type="button"
          isActive={activeDrawer === 'availability'}
          onClick={() => {
            setActiveDrawer(
              activeDrawer === 'availability' ? null : 'availability'
            );
          }}
        >
          <Icon name="chevron" />
          Availability
        </ProtoTag>
      </Space>
      <div className={`${activeDrawer !== 'date' && 'is-hidden'}`}>
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
                    clear dates
                  </a>
                </NextLink>
              )}
            </Space>
          </div>
        </Space>
      </div>
      <div className={`${activeDrawer !== 'format' && 'is-hidden'}`}>
        <>
          {allWorkTypes.map(subcategory => (
            <NextLink
              key={subcategory.title}
              passHref
              {...worksUrl({
                query,
                workType: updateWorkTypes(
                  workType || allWorkTypes,
                  subcategory,
                  _isFilteringBySubcategory
                ),
                page: 1,
                _dateFrom,
                _dateTo,
                _isFilteringBySubcategory: isLastFilterItem(
                  workType || allWorkTypes,
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
                  workType &&
                  workType.includes(subcategory.letter)
                }
              >
                {subcategory.title}
              </ProtoTag>
            </NextLink>
          ))}
          {/* {_isFilteringBySubcategory && (
            <NextLink
              {...worksUrl({
                query,
                workType,
                page: 1,
                _dateFrom,
                _dateTo,
              })}
            >
              <a className={font('hnm', 6)}>clear format filter</a>
            </NextLink>
          )} */}
        </>
      </div>
      <div className={`${activeDrawer !== 'availability' && 'is-hidden'}`}>
        <div>
          <ProtoTag
            as="button"
            type="button"
            onClick={() => {
              setFakeIsAvailableOnline(!fakeIsAvailableOnline);
            }}
            isActive={fakeIsAvailableOnline}
            style={{ cursor: 'pointer' }}
          >
            Online
          </ProtoTag>
          <ProtoTag
            as="button"
            type="button"
            onClick={() => {
              setFakeIsAvailableInLibrary(!fakeIsAvailableInLibrary);
            }}
            isActive={fakeIsAvailableInLibrary}
            style={{ cursor: 'pointer' }}
          >
            In library
          </ProtoTag>
          {/* {(fakeIsAvailableInLibrary || fakeIsAvailableOnline) && (
            <a
              href="#"
              onClick={() => {
                setFakeIsAvailableOnline(false);
                setFakeIsAvailableInLibrary(false);
              }}
              className={font('hnm', 6)}
              style={{ marginLeft: '6px', cursor: 'pointer' }}
            >
              clear availablity filter
            </a>
          )} */}
        </div>
      </div>

      <Space v={{ size: 'l', properties: ['margin-top'] }} className="tokens">
        {allWorkTypes.map(subcategory => (
          <>
            {_isFilteringBySubcategory &&
              workType &&
              workType.includes(subcategory.letter) && (
                <NextLink
                  key={subcategory.title}
                  passHref
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
                  <ProtoTag as="a" isActive small>
                    &times; {subcategory.title}
                  </ProtoTag>
                </NextLink>
              )}
          </>
        ))}
        {_dateFrom && (
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType: workType || allWorkTypes,
              page: 1,
              _dateFrom: null,
              _dateTo,
              _isFilteringBySubcategory,
            })}
          >
            <ProtoTag as="a" isActive small>
              &times; from: {_dateFrom}
            </ProtoTag>
          </NextLink>
        )}
        {_dateTo && (
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType: workType || allWorkTypes,
              page: 1,
              _dateFrom,
              _dateTo: null,
              _isFilteringBySubcategory,
            })}
          >
            <ProtoTag as="a" isActive small>
              &times; to: {_dateTo}
            </ProtoTag>
          </NextLink>
        )}

        {fakeIsAvailableOnline && (
          <ProtoTag
            isActive
            small
            onClick={() => setFakeIsAvailableOnline(false)}
          >
            &times; online
          </ProtoTag>
        )}

        {fakeIsAvailableInLibrary && (
          <ProtoTag
            isActive
            small
            onClick={() => setFakeIsAvailableInLibrary(false)}
          >
            &times; in library
          </ProtoTag>
        )}

        {(_isFilteringBySubcategory ||
          _dateFrom ||
          _dateTo ||
          fakeIsAvailableInLibrary ||
          fakeIsAvailableOnline) && (
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
                setActiveDrawer(null);
              }}
            >
              clear all filters
            </a>
          </NextLink>
        )}
      </Space>
    </div>
  );
}

export default FilterDrawer;
