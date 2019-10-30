import { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { worksUrl } from '../../../services/catalogue/urls';
import { font, classNames } from '../../../utils/classnames';
import ProtoTag from '../styled/ProtoTag';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import Divider from '@weco/common/views/components/Divider/Divider';
import {
  onlineLocations,
  inLibraryLocations,
} from '@weco/common/views/components/FilterDrawerRefine/accessLocations';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';

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

function CancelFilter({ text }: { text: string }) {
  return (
    <Space
      as="span"
      h={{
        size: 'm',
        properties: ['margin-right'],
      }}
    >
      <Space
        as="span"
        h={{
          size: 'xs',
          properties: ['margin-right'],
        }}
      >
        <Icon
          name="cross"
          extraClasses="icon--match-text icon--silver v-align-middle"
        />
      </Space>
      <span className="visually-hidden">remove </span>
      {text}
    </Space>
  );
}

type Props = {|
  searchForm: React.Ref<typeof HTMLFormElement>,
  searchParams: SearchParams,
  workTypeAggregations: any,
|};

const FilterDrawerRefine = ({
  searchForm,
  searchParams,
  workTypeAggregations,
}: Props) => {
  const {
    productionDatesFrom,
    productionDatesTo,
    workType,
    itemsLocationsLocationType,
  } = searchParams;
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const { unfilteredSearchResults } = useContext(TogglesContext);

  function submit() {
    if (searchForm.current) {
      searchForm.current.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );
    }
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
      submit(unfilteredSearchResults, searchForm.current);
    }
  }, [inputDateFrom]);

  useEffect(() => {
    if (
      productionDatesTo !== inputDateTo &&
      (!inputDateTo || (inputDateTo && inputDateTo.match(/^\d{4}$/)))
    ) {
      submit(unfilteredSearchResults, searchForm.current);
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
                      <Space
                        as="span"
                        h={{ size: 'm', properties: ['margin-right'] }}
                      >
                        <NumberInput
                          label="From"
                          min="0"
                          max="9999"
                          placeholder={'Year'}
                          name="production.dates.from"
                          value={inputDateFrom || ''}
                          onChange={event => {
                            setInputDateFrom(`${event.currentTarget.value}`);
                          }}
                        />
                      </Space>
                      <NumberInput
                        label="to"
                        min="0"
                        max="9999"
                        placeholder={'Year'}
                        name="production.dates.to"
                        value={inputDateTo || ''}
                        onChange={event => {
                          setInputDateTo(`${event.currentTarget.value}`);
                        }}
                      />
                    </Space>
                  ),
                },
                {
                  title: 'Formats',
                  component: (
                    <Space v={{ size: 'l', properties: ['margin-top'] }}>
                      {workTypeAggregations.map(type => (
                        <Space
                          key={type.data.id}
                          as="span"
                          h={{ size: 'm', properties: ['margin-right'] }}
                        >
                          <Checkbox
                            id={type.data.id}
                            text={`${type.data.label} (${type.count})`}
                            value={type.data.id}
                            name={`workType`}
                            checked={searchParams.workType.includes(
                              type.data.id
                            )}
                            onChange={event => {
                              const value = event.currentTarget.value;
                              const isChecked = event.currentTarget.checked;

                              searchParams.workType = !isChecked
                                ? searchParams.workType.filter(w => w !== value)
                                : [...searchParams.workType, value];

                              submit();
                            }}
                          />
                        </Space>
                      ))}
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
              ></div>
              <div
                className={`${
                  activeDrawer !== 'availability' ? 'is-hidden' : ''
                }`}
              >
                <div>
                  <NextLink
                    passHref
                    {...worksUrl({
                      ...searchParams,
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
                      ...searchParams,
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
                        ...searchParams,
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
            {(productionDatesFrom || productionDatesTo) && (
              <div className={classNames({ [font('hnl', 5)]: true })}>
                <Divider extraClasses={'divider--thin divider--pumice'} />
                <Space
                  v={{
                    size: 'l',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <h2 className="inline">
                    <Space
                      as="span"
                      h={{
                        size: 'm',
                        properties: ['margin-right'],
                      }}
                    >
                      Active filters:
                    </Space>
                  </h2>
                  {productionDatesFrom && (
                    <NextLink
                      passHref
                      {...worksUrl({
                        ...searchParams,
                        page: 1,
                        productionDatesFrom: null,
                      })}
                    >
                      <a>
                        <CancelFilter text={`From ${productionDatesFrom}`} />
                      </a>
                    </NextLink>
                  )}
                  {productionDatesTo && (
                    <NextLink
                      passHref
                      {...worksUrl({
                        ...searchParams,
                        page: 1,
                        productionDatesTo: null,
                      })}
                    >
                      <a>
                        <CancelFilter text={`To ${productionDatesTo}`} />
                      </a>
                    </NextLink>
                  )}
                  <NextLink
                    passHref
                    {...worksUrl({
                      ...searchParams,
                      workType: null,
                      page: 1,
                      productionDatesFrom: null,
                      productionDatesTo: null,
                      itemsLocationsLocationType: null,
                    })}
                  >
                    <a
                      onClick={() => {
                        setActiveDrawer(null);
                      }}
                    >
                      <CancelFilter text={'Clear all'} />
                    </a>
                  </NextLink>
                </Space>
              </div>
            )}
            {refineFiltersPrototype &&
              itemsLocationsLocationType &&
              onlineLocations.every(t =>
                itemsLocationsLocationType.includes(t)
              ) && (
                <NextLink
                  passHref
                  {...worksUrl({
                    ...searchParams,
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
                    ...searchParams,
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
          </Space>
        </div>
      )}
    </TogglesContext.Consumer>
  );
};

export default FilterDrawerRefine;
