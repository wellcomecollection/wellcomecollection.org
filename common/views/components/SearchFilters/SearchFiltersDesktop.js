// @flow

import { useContext } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { worksLink } from '../../../services/catalogue/routes';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
// $FlowFixMe (tsx)
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
// $FlowFixMe (tsx)
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import TogglesContext from '../TogglesContext/TogglesContext';
import { type SearchFiltersSharedProps } from './SearchFilters';

// $FlowFixMe (tsx)
const ColorPicker = dynamic(() => import('../ColorPicker/ColorPicker'));

const CancelFilter = ({ text }: { text: string }) => {
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
  inputImagesColor,
  setInputImagesColor,
}: SearchFiltersSharedProps) => {
  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;
  const { enableColorFiltering } = useContext(TogglesContext);
  const showColorFilter =
    enableColorFiltering && worksRouteProps.search === 'images';

  return (
    <>
      <Space
        v={{
          size: 'l',
          properties: ['margin-top', 'margin-bottom'],
        }}
        className={classNames({
          flex: true,
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
        <Space
          h={{ size: 's', properties: ['margin-right'] }}
          className={classNames({
            [font('hnl', 5)]: true,
          })}
        >
          <DropdownButton label={'Dates'} isInline={true}>
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
          <DropdownButton label={'Formats'} isInline={true}>
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
        {showColorFilter && (
          <Space
            h={{ size: 's', properties: ['margin-left'] }}
            className={classNames({
              [font('hnl', 5)]: true,
            })}
          >
            <DropdownButton label={'Colors'} isInline={true}>
              <ColorPicker
                name="images.color"
                color={inputImagesColor}
                onChangeColor={setInputImagesColor}
              />
            </DropdownButton>
          </Space>
        )}
      </Space>

      <Space v={{ size: 'l', properties: ['margin-top'] }} className="tokens">
        {(productionDatesFrom ||
          productionDatesTo ||
          workTypeInUrlArray.length > 0) &&
          workTypeFilters.length > 0 && (
            <div className={classNames({ [font('hnl', 5)]: true })}>
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

                {workTypeFilters.length > 0 && (
                  <NextLink
                    passHref
                    {...worksLink(
                      {
                        ...worksRouteProps,
                        itemsLocationsLocationType: [],
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
              </Space>
            </div>
          )}
      </Space>
    </>
  );
};

export default SearchFiltersDesktop;
