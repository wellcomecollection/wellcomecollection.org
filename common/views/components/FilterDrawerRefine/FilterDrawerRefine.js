import { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import Router from 'next/router';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { worksUrl } from '../../../services/catalogue/urls';
import { clientSideSearchParams } from '../../../services/catalogue/search-params';
import { font } from '../../../utils/classnames';
import ProtoTag from '../styled/ProtoTag';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import {
  onlineLocations,
  inLibraryLocations,
} from '@weco/common/views/components/FilterDrawerRefine/accessLocations';
import {
  type SearchParams,
  defaultWorkTypes,
} from '@weco/common/services/catalogue/search-params';

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

function updateWorkTypes(workType, subcategory) {
  return workType.includes(subcategory.letter)
    ? workType.filter(t => t !== subcategory.letter)
    : workType.concat(subcategory.letter);
}

function FilterDrawerRefine({
  searchForm,
  searchParams,
}: {
  searchForm: ?HTMLFormElement,
  searchParams: SearchParams,
}) {
  const params = clientSideSearchParams();
  const {
    workType,
    itemsLocationsLocationType,
    productionDatesFrom,
    productionDatesTo,
  } = params;
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const { unfilteredSearchResults } = useContext(TogglesContext);

  function updateUrl(unfilteredSearchResults: boolean, form: ?HTMLFormElement) {
    const workType = searchParams.workType || [];
    const link = unfilteredSearchResults
      ? worksUrl({
          ...searchParams,
          // Override the defaultWorkType with [] if we're toggled to do so
          workType: workType.length === defaultWorkTypes.length ? [] : workType,
          query: form.query.value,
          page: 1,
          productionDatesFrom: form.productionDatesFrom.value,
          productionDatesTo: form.productionDatesTo.value,
        })
      : worksUrl({
          ...searchParams,
          query: form.query.value,
          page: 1,
          productionDatesFrom: form.productionDatesFrom.value,
          productionDatesTo: form.productionDatesTo.value,
        });

    Router.push(link.href, link.as);
  }

  useEffect(() => {
    if (productionDatesFrom !== inputDateFrom) {
      setInputDateFrom(productionDatesFrom);
    }

    if (productionDatesTo !== inputDateTo) {
      setInputDateTo(productionDatesTo);
    }
  }, [productionDatesFrom, productionDatesTo]);

  useEffect(() => {
    if (
      productionDatesFrom !== inputDateFrom &&
      (!inputDateFrom || (inputDateFrom && inputDateFrom.match(/^\d{4}$/)))
    ) {
      updateUrl(unfilteredSearchResults, searchForm.current);
    }
  }, [inputDateFrom]);

  useEffect(() => {
    if (
      productionDatesTo !== inputDateTo &&
      (!inputDateTo || (inputDateTo && inputDateTo.match(/^\d{4}$/)))
    ) {
      updateUrl(unfilteredSearchResults, searchForm.current);
    }
  }, [inputDateTo]);

  return (
    <TogglesContext.Consumer>
      {({ refineFiltersPrototype }) => (
        <div>
          <Space
            v={{
              size: 'l',
              properties: ['margin-top', 'margin-bottom'],
            }}
          >
            <FilterDrawer
              items={[
                {
                  title: 'Dates',
                  component: (
                    <Space v={{ size: 'l', properties: ['margin-top'] }}>
                      <span className={font('hnm', 5)}>Between </span>
                      <label>
                        <span className="visually-hidden">from: </span>
                        <input
                          type="number"
                          min="0"
                          max="9999"
                          placeholder={'year'}
                          name="productionDatesFrom"
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
                          type="number"
                          min="0"
                          max="9999"
                          placeholder={'year'}
                          name="productionDatesTo"
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
                    </Space>
                  ),
                },
              ]}
            />
            {refineFiltersPrototype && (
              <>
                <ProtoTag
                  as="button"
                  type="button"
                  isPrimary
                  isActive={activeDrawer === 'format'}
                  onClick={() => {
                    setActiveDrawer(
                      activeDrawer === 'format' ? null : 'format'
                    );
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
              </>
            )}
          </Space>
          {refineFiltersPrototype && (
            <>
              <div
                className={`${activeDrawer !== 'format' ? 'is-hidden' : ''}`}
              >
                <>
                  {allWorkTypes.map(subcategory => (
                    <NextLink
                      key={subcategory.title}
                      passHref
                      {...worksUrl({
                        ...params,
                        workType: updateWorkTypes(workType, subcategory),
                        page: 1,
                      })}
                    >
                      <ProtoTag
                        as="a"
                        isActive={
                          workType && workType.includes(subcategory.letter)
                        }
                      >
                        {subcategory.title}
                      </ProtoTag>
                    </NextLink>
                  ))}
                </>
              </div>
              <div
                className={`${
                  activeDrawer !== 'availability' ? 'is-hidden' : ''
                }`}
              >
                <div>
                  <NextLink
                    passHref
                    {...worksUrl({
                      ...params,
                      page: 1,
                      itemsLocationsLocationType: updateLocations(
                        itemsLocationsLocationType,
                        'online'
                      ),
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
                      ...params,
                      page: 1,
                      itemsLocationsLocationType: updateLocations(
                        itemsLocationsLocationType,
                        'library'
                      ),
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
            </>
          )}
          <Space
            v={{ size: 'l', properties: ['margin-top'] }}
            className="tokens"
          >
            {refineFiltersPrototype &&
              allWorkTypes.map(subcategory => {
                return (
                  workType &&
                  workType.includes(subcategory.letter) && (
                    <NextLink
                      key={subcategory.title}
                      passHref
                      {...worksUrl({
                        ...params,
                        workType: updateWorkTypes(workType, subcategory),
                        page: 1,
                      })}
                    >
                      <ProtoTag as="a" isActive small>
                        &times; {subcategory.title}
                      </ProtoTag>
                    </NextLink>
                  )
                );
              })}

            {productionDatesFrom && (
              <NextLink
                passHref
                {...worksUrl({
                  ...params,
                  workType: workType,
                  page: 1,
                  productionDatesFrom: null,
                })}
              >
                <ProtoTag as="a" isActive small>
                  &times; from: {productionDatesFrom}
                </ProtoTag>
              </NextLink>
            )}
            {productionDatesTo && (
              <NextLink
                passHref
                {...worksUrl({
                  ...params,
                  workType: workType,
                  page: 1,
                  productionDatesTo: null,
                })}
              >
                <ProtoTag as="a" isActive small>
                  &times; to: {productionDatesTo}
                </ProtoTag>
              </NextLink>
            )}

            {refineFiltersPrototype &&
              itemsLocationsLocationType &&
              onlineLocations.every(t =>
                itemsLocationsLocationType.includes(t)
              ) && (
                <NextLink
                  passHref
                  {...worksUrl({
                    ...params,
                    page: 1,
                    itemsLocationsLocationType: updateLocations(
                      itemsLocationsLocationType,
                      'online'
                    ),
                  })}
                >
                  <ProtoTag as="button" type="button" isActive small>
                    &times; online
                  </ProtoTag>
                </NextLink>
              )}

            {refineFiltersPrototype &&
              itemsLocationsLocationType &&
              inLibraryLocations.every(t =>
                itemsLocationsLocationType.includes(t)
              ) && (
                <NextLink
                  passHref
                  {...worksUrl({
                    ...params,
                    page: 1,
                    itemsLocationsLocationType: updateLocations(
                      itemsLocationsLocationType,
                      'library'
                    ),
                  })}
                >
                  <ProtoTag as="button" type="button" isActive small>
                    &times; in library
                  </ProtoTag>
                </NextLink>
              )}

            {(productionDatesFrom || productionDatesTo) && (
              <NextLink
                passHref
                {...worksUrl({
                  ...params,
                  workType: null,
                  page: 1,
                  productionDatesFrom: null,
                  productionDatesTo: null,
                  _location: null,
                  itemsLocationsLocationType: null,
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
      )}
    </TogglesContext.Consumer>
  );
}

export default FilterDrawerRefine;
