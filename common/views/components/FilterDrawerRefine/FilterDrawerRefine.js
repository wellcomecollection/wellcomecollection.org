import { useContext, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { worksUrl } from '../../../services/catalogue/urls';
import { font } from '../../../utils/classnames';
import ProtoTag from '../styled/ProtoTag';
import Space from '../styled/Space';
import CatalogueSearchContext from '../CatalogueSearchContext/CatalogueSearchContext';
import Icon from '../Icon/Icon';
import {
  onlineLocations,
  inLibraryLocations,
} from '@weco/common/views/components/AccessFilter/AccessFilter';

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

function updateLocations(selectedLocations, location) {
  if (!selectedLocations) {
    return location === 'library'
      ? inLibraryLocations
      : location === 'online'
      ? onlineLocations
      : null;
  }

  if (
    location === 'library' &&
    inLibraryLocations.every(t => selectedLocations.includes(t))
  ) {
    const locationsWithoutInLibrary = selectedLocations.filter(value => {
      return !inLibraryLocations.includes(value);
    });
    return locationsWithoutInLibrary.length > 0
      ? locationsWithoutInLibrary
      : null;
  } else if (
    location === 'online' &&
    onlineLocations.every(t => selectedLocations.includes(t))
  ) {
    const locationsWithoutOnline = selectedLocations.filter(value => {
      return !onlineLocations.includes(value);
    });
    return locationsWithoutOnline.length > 0 ? locationsWithoutOnline : null;
  } else {
    return [...onlineLocations, ...inLibraryLocations];
  }
}

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

function FilterDrawerRefine() {
  const {
    query,
    workType,
    itemsLocationsLocationType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
  } = useContext(CatalogueSearchContext);
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
          isPrimary
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
          isPrimary
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
          isPrimary
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
                    itemsLocationsLocationType,
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
                    itemsLocationsLocationType,
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
                itemsLocationsLocationType,
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
        </>
      </div>
      <div className={`${activeDrawer !== 'availability' && 'is-hidden'}`}>
        <div>
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType,
              page: 1,
              _dateFrom,
              _dateTo,
              itemsLocationsLocationType: updateLocations(
                itemsLocationsLocationType,
                'online'
              ),
              _isFilteringBySubcategory,
            })}
          >
            <ProtoTag
              as="button"
              type="button"
              isActive={
                itemsLocationsLocationType &&
                onlineLocations.every(t =>
                  itemsLocationsLocationType.includes(t)
                )
              }
              style={{ cursor: 'pointer' }}
            >
              online
            </ProtoTag>
          </NextLink>
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType,
              page: 1,
              _dateFrom,
              _dateTo,
              itemsLocationsLocationType: updateLocations(
                itemsLocationsLocationType,
                'library'
              ),
              _isFilteringBySubcategory,
            })}
          >
            <ProtoTag
              as="button"
              type="button"
              isActive={
                itemsLocationsLocationType &&
                inLibraryLocations.every(t =>
                  itemsLocationsLocationType.includes(t)
                )
              }
              style={{ cursor: 'pointer' }}
            >
              in library
            </ProtoTag>
          </NextLink>
        </div>
      </div>

      <Space v={{ size: 'l', properties: ['margin-top'] }} className="tokens">
        {allWorkTypes.map(subcategory => {
          return (
            _isFilteringBySubcategory &&
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
                  itemsLocationsLocationType,
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
            )
          );
        })}
        {_dateFrom && (
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType: workType || allWorkTypes,
              page: 1,
              _dateFrom: null,
              _dateTo,
              itemsLocationsLocationType,
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
              itemsLocationsLocationType,
              _isFilteringBySubcategory,
            })}
          >
            <ProtoTag as="a" isActive small>
              &times; to: {_dateTo}
            </ProtoTag>
          </NextLink>
        )}

        {itemsLocationsLocationType &&
          onlineLocations.every(t =>
            itemsLocationsLocationType.includes(t)
          ) && (
            <NextLink
              passHref
              {...worksUrl({
                query,
                workType,
                page: 1,
                _dateFrom,
                _dateTo,
                itemsLocationsLocationType: updateLocations(
                  itemsLocationsLocationType,
                  'online'
                ),
                _isFilteringBySubcategory,
              })}
            >
              <ProtoTag as="button" type="button" isActive small>
                &times; online
              </ProtoTag>
            </NextLink>
          )}

        {itemsLocationsLocationType &&
          inLibraryLocations.every(t =>
            itemsLocationsLocationType.includes(t)
          ) && (
            <NextLink
              passHref
              {...worksUrl({
                query,
                workType,
                page: 1,
                _dateFrom,
                _dateTo,
                itemsLocationsLocationType: updateLocations(
                  itemsLocationsLocationType,
                  'library'
                ),
                _isFilteringBySubcategory,
              })}
            >
              <ProtoTag as="button" type="button" isActive small>
                &times; in library
              </ProtoTag>
            </NextLink>
          )}

        {(_isFilteringBySubcategory ||
          _dateFrom ||
          _dateTo ||
          itemsLocationsLocationType) && (
          <NextLink
            passHref
            {...worksUrl({
              query,
              workType: null,
              page: 1,
              _dateFrom: null,
              _dateTo: null,
              _location: null,
              itemsLocationsLocationType: null,
              _isFilteringBySubcategory: false,
            })}
          >
            <a
              className={font('hnm', 6)}
              onClick={() => {
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

export default FilterDrawerRefine;
