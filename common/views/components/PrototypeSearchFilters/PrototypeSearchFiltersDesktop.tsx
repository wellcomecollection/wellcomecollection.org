import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';
import { worksLink, imagesLink } from '../../../services/catalogue/ts_routes';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { SearchFiltersSharedProps } from './PrototypeSearchFilters';

const ColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});

const ColorSwatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  margin-left: 6px;
  padding-top: 2px;
`;

const CancelFilter = ({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) => {
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
      {text || children}
    </Space>
  );
};

const SearchFiltersDesktop = ({
  filtersToShow,
  worksRouteProps,
  changeHandler,
  inputDateFrom,
  inputDateTo,
  setInputDateFrom,
  setInputDateTo,
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  workTypeInUrlArray,
  imagesColor,
  aggregations,
}: SearchFiltersSharedProps) => {
  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;

  const resetFiltersRoute = {
    ...worksRouteProps,
    itemsLocationsLocationType: [],
    itemsLocationsType: [],
    workType: [],
    page: 1,
    productionDatesFrom: null,
    productionDatesTo: null,
  };

  const resetFilters = imagesColor
    ? imagesLink(
        { ...resetFiltersRoute, locationsLicense: null, color: null },
        'cancel_filter/all'
      )
    : worksLink(resetFiltersRoute, 'cancel_filter/all');

  function showActiveFilters() {
    return (
      imagesColor ||
      ((productionDatesFrom ||
        productionDatesTo ||
        workTypeInUrlArray.length > 0 ||
        worksRouteProps?.itemsLocationsType?.length > 0) &&
        workTypeFilters.length > 0)
    );
  }

  return (
    <>
      <Space
        v={{
          size: 'm',
          properties: ['padding-top'],
        }}
        className={classNames({
          flex: true,
        })}
        style={{ background: '#f4f4f4' }}
      >
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          className={classNames({
            'flex flex--h-space-between flex--v-center full-width flex--wrap': true,
          })}
        >
          <Space
            v={{ size: 'm', properties: ['margin-bottom'] }}
            className={classNames({
              'flex flex--v-center': true,
            })}
          >
            <Space
              as="span"
              h={{ size: 'm', properties: ['margin-right'] }}
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              <Icon name="filter" />
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                className={classNames({
                  [font('hnm', 5)]: true,
                })}
              >
                Filter by
              </Space>
            </Space>

            {showWorkTypeFilters && filtersToShow.includes('formats') && (
              <Space h={{ size: 's', properties: ['margin-right'] }}>
                <DropdownButton label={'Formats'} isInline={true} id="formats">
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list': true,
                      [font('hnl', 5)]: true,
                    })}
                  >
                    {workTypeFilters.map(workType => {
                      const isChecked = workTypeInUrlArray.includes(
                        workType.data.id
                      );

                      return (
                        (workType.count > 0 || isChecked) && (
                          <li key={workType.data.id}>
                            <CheckboxRadio
                              id={workType.data.id}
                              type={`checkbox`}
                              text={`${workType.data.label} (${workType.count})`}
                              value={workType.data.id}
                              name={`workType`}
                              checked={isChecked}
                              onChange={changeHandler}
                            />
                          </li>
                        )
                      );
                    })}
                  </ul>
                </DropdownButton>
              </Space>
            )}

            {filtersToShow.includes('dates') && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
              >
                <DropdownButton label={'Dates'} isInline={true} id="dates">
                  <>
                    <Space
                      as="span"
                      h={{ size: 'm', properties: ['margin-right'] }}
                    >
                      <NumberInput
                        name="production.dates.from"
                        label="From"
                        min="0"
                        max="9999"
                        placeholder={'Year'}
                        value={inputDateFrom || ''}
                        onChange={event => {
                          setInputDateFrom(`${event.currentTarget.value}`);
                        }}
                      />
                    </Space>
                    <NumberInput
                      name="production.dates.to"
                      label="to"
                      min="0"
                      max="9999"
                      placeholder={'Year'}
                      value={inputDateTo || ''}
                      onChange={event => {
                        setInputDateTo(`${event.currentTarget.value}`);
                      }}
                    />
                  </>
                </DropdownButton>
              </Space>
            )}

            {filtersToShow.includes('colors') && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
              >
                <DropdownButton
                  label={'Colours'}
                  isInline={true}
                  id="images.color"
                >
                  <ColorPicker
                    name="images.color"
                    color={imagesColor}
                    onChangeColor={changeHandler}
                  />
                </DropdownButton>
              </Space>
            )}
          </Space>

          {filtersToShow.includes('locations') &&
            aggregations &&
            aggregations.locationType && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={classNames({
                  'flex flex--v-center': true,
                })}
              >
                <Icon name="eye" />
                <Space
                  h={{ size: 's', properties: ['margin-left'] }}
                  className={classNames({
                    [font('hnm', 5)]: true,
                  })}
                >
                  Show items available
                </Space>
                <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list flex': true,
                      [font('hnl', 5)]: true,
                    })}
                  >
                    {aggregations.locationType.buckets
                      .sort((a, b) => b.data.label.localeCompare(a.data.label)) // Ensure 'Online' appears before 'In the library'
                      .map(locationType => {
                        const isChecked = worksRouteProps.itemsLocationsType.includes(
                          locationType.data.type
                        );

                        return (
                          <Space
                            as="li"
                            h={{ size: 's', properties: ['margin-left'] }}
                            key={locationType.data.type}
                            className={classNames({
                              flex: true,
                            })}
                          >
                            <CheckboxRadio
                              id={locationType.data.type}
                              type={`checkbox`}
                              text={`${locationType.data.label} (${locationType.count})`}
                              value={locationType.data.type}
                              name={`items.locations.type`}
                              checked={isChecked}
                              onChange={changeHandler}
                            />
                          </Space>
                        );
                      })}
                  </ul>
                </Space>
              </Space>
            )}
        </Space>
      </Space>

      {showActiveFilters() && (
        <Space
          v={{ size: 's', properties: ['padding-top'] }}
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          className="tokens bg-white"
        >
          <div className={classNames({ [font('hnm', 5)]: true })}>
            <div>
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
                  {...worksLink(
                    {
                      ...worksRouteProps,
                      page: 1,
                      productionDatesFrom: null,
                    },
                    'cancel_filter/production_dates_from'
                  )}
                >
                  <a>
                    <CancelFilter text={`From ${productionDatesFrom}`} />
                  </a>
                </NextLink>
              )}
              {productionDatesTo && (
                <NextLink
                  passHref
                  {...worksLink(
                    {
                      ...worksRouteProps,
                      page: 1,
                      productionDatesTo: null,
                    },
                    'cancel_filter/production_dates_to'
                  )}
                >
                  <a>
                    <CancelFilter text={`To ${productionDatesTo}`} />
                  </a>
                </NextLink>
              )}
              {imagesColor && (
                <NextLink
                  passHref
                  {...imagesLink(
                    {
                      ...worksRouteProps,
                      page: 1,
                      color: null,
                      locationsLicense: null,
                    },
                    'cancel_filter/images_color'
                  )}
                >
                  <a>
                    <CancelFilter>
                      Colour
                      <ColorSwatch color={`#${imagesColor}`} />
                    </CancelFilter>
                  </a>
                </NextLink>
              )}

              {workTypeInUrlArray.map(id => {
                const workTypeObject = workTypeFilters.find(({ data }) => {
                  return data.id === id;
                });

                return (
                  workTypeObject && (
                    <NextLink
                      key={id}
                      {...worksLink(
                        {
                          ...worksRouteProps,
                          workType: worksRouteProps.workType.filter(
                            w => w !== workTypeObject.data.id
                          ),
                          page: 1,
                        },
                        'cancel_filter/work_types'
                      )}
                    >
                      <a>
                        <CancelFilter text={workTypeObject.data.label} />
                      </a>
                    </NextLink>
                  )
                );
              })}

              {aggregations &&
                aggregations.locationType.buckets
                  .filter(locationType =>
                    worksRouteProps.itemsLocationsType.includes(
                      locationType.data.type
                    )
                  )
                  .map(locationType => (
                    <NextLink
                      key={locationType.type}
                      passHref
                      {...worksLink(
                        {
                          ...worksRouteProps,
                          itemsLocationsType: worksRouteProps.itemsLocationsType.filter(
                            type => type !== locationType.data.type
                          ),
                          page: 1,
                        },
                        'cancel_filter/items_locations_type'
                      )}
                    >
                      <a>
                        <CancelFilter text={locationType.data.label} />
                      </a>
                    </NextLink>
                  ))}

              <NextLink passHref {...resetFilters}>
                <a>
                  <CancelFilter text={'Reset filters'} />
                </a>
              </NextLink>
            </div>
          </div>
        </Space>
      )}
    </>
  );
};

export default SearchFiltersDesktop;
