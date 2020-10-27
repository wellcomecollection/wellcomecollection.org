import { useContext } from 'react';
import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';
import { worksLink } from '../../../services/catalogue/routes';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import TogglesContext from '../TogglesContext/TogglesContext';
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
  children?: JSX.Element;
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
  searchForm,
  worksRouteProps,
  workTypeAggregations,
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
  const { enableColorFiltering, locationsFilter } = useContext(TogglesContext);
  const showColorFilter =
    enableColorFiltering && worksRouteProps.search === 'images';

  return (
    <>
      <Space
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom', 'margin-top'],
        }}
        className={classNames({
          flex: true,
          'bg-smoke': true,
        })}
      >
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        ></Space>
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
        <Space
          h={{ size: 's', properties: ['margin-right'] }}
          className={classNames({
            [font('hnl', 5)]: true,
          })}
        >
          <DropdownButton label={'Dates'} isInline={true} id="dates">
            <>
              <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
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

        {showWorkTypeFilters && (
          <DropdownButton label={'Formats'} isInline={true} id="formats">
            <ul
              className={classNames({
                'no-margin no-padding plain-list': true,
                [font('hnl', 5)]: true,
              })}
            >
              {workTypeFilters.map(workType => {
                const isChecked = workTypeInUrlArray.includes(workType.data.id);

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
        )}

        {locationsFilter && aggregations && aggregations.locationType && (
          <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
            <DropdownButton label={'Locations'} isInline={true}>
              <ul
                className={classNames({
                  'no-margin no-padding plain-list': true,
                  [font('hnl', 5)]: true,
                })}
              >
                {aggregations.locationType.buckets.map(locationType => {
                  const isChecked = worksRouteProps.itemsLocationsType.includes(
                    locationType.data.type
                  );

                  return (
                    (locationType.count > 0 || isChecked) && (
                      <li key={locationType.data.type}>
                        <CheckboxRadio
                          id={locationType.data.type}
                          type={`checkbox`}
                          text={`${locationType.data.label} (${locationType.count})`}
                          value={locationType.data.type}
                          name={`items.locations.type`}
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

        {showColorFilter && (
          <Space
            h={{ size: 's', properties: ['margin-left'] }}
            className={classNames({
              [font('hnl', 5)]: true,
            })}
          >
            <DropdownButton label={'Colours'} isInline={true}>
              <ColorPicker
                name="images.color"
                color={imagesColor}
                onChangeColor={changeHandler}
              />
            </DropdownButton>
          </Space>
        )}
      </Space>

      {(productionDatesFrom ||
        productionDatesTo ||
        (imagesColor && showColorFilter) ||
        workTypeInUrlArray.length > 0 ||
        worksRouteProps?.itemsLocationsType?.length > 0) &&
        (workTypeFilters.length > 0 || worksRouteProps.search === 'images') && (
          <Space
            v={{ size: 's', properties: ['padding-top'] }}
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            className="tokens bg-white"
          >
            <div className={classNames({ [font('hnl', 5)]: true })}>
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
                {imagesColor && showColorFilter && (
                  <NextLink
                    passHref
                    {...worksLink(
                      { ...worksRouteProps, page: 1, imagesColor: null },
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

                {worksRouteProps.itemsLocationsType.length > 0 && (
                  <NextLink
                    passHref
                    {...worksLink(
                      {
                        ...worksRouteProps,
                        itemsLocationsLocationType: [],
                        itemsLocationsType: [],
                        workType: [],
                        page: 1,
                        productionDatesFrom: null,
                        productionDatesTo: null,
                      },
                      'cancel_filter/all'
                    )}
                  >
                    <a>
                      <CancelFilter text={'Clear all'} />
                    </a>
                  </NextLink>
                )}
              </div>
            </div>
          </Space>
        )}
    </>
  );
};

export default SearchFiltersDesktop;
