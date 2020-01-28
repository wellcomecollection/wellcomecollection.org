// @flow
import { font, classNames } from '../../../utils/classnames';
import { worksLink } from '../../../services/catalogue/codecs';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import NextLink from 'next/link';
import { type SearchFiltersSharedProps } from './SearchFilters';
import TogglesContext from '../TogglesContext/TogglesContext';

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
  worksParams,
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
}: SearchFiltersSharedProps) => {
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
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          <DropdownButton label={'Dates'}>
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

        {workTypeFilters.length > 0 && (
          <DropdownButton label={'Formats'}>
            <ul
              className={classNames({
                'no-margin no-padding plain-list': true,
              })}
            >
              {workTypeFilters.map(workType => {
                return (
                  <li key={workType.data.id}>
                    <Checkbox
                      id={workType.data.id}
                      text={`${workType.data.label} (${workType.count})`}
                      value={workType.data.id}
                      name={`workType`}
                      checked={
                        workTypeInUrlArray &&
                        workTypeInUrlArray.includes(workType.data.id)
                      }
                      onChange={event => {
                        changeHandler();
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </DropdownButton>
        )}

        <TogglesContext.Consumer>
          {({ unfilteredSearchResults }) =>
            unfilteredSearchResults && (
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                v={{ size: 'xs', properties: ['margin-top'] }}
              >
                <div className="flex">
                  <Checkbox
                    id="digitised"
                    text={`Digitised`}
                    value={'iiif-image,iiif-presentation'}
                    name={`items.locations.locationType`}
                    checked={
                      (worksParams.itemsLocationsLocationType || []).join(
                        ','
                      ) === 'iiif-image,iiif-presentation'
                    }
                    onChange={event => {
                      changeHandler();
                    }}
                  />
                  <Space
                    h={{ size: 's', properties: ['margin-left'] }}
                    v={{ size: 's', properties: ['margin-top'] }}
                  >
                    <Icon
                      name="info2"
                      extraClasses="pointer"
                      title={
                        'Currently includes works with a IIIF Image or IIIF presentation manifest'
                      }
                    />
                  </Space>
                </div>
              </Space>
            )
          }
        </TogglesContext.Consumer>
      </Space>

      <Space v={{ size: 'l', properties: ['margin-top'] }} className="tokens">
        {(productionDatesFrom ||
          productionDatesTo ||
          workTypeInUrlArray.length > 0) && (
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
                  {...worksLink({
                    ...worksParams,
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
                  {...worksLink({
                    ...worksParams,
                    productionDatesTo: null,
                  })}
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
                  <NextLink
                    key={id}
                    {...worksLink({
                      ...worksParams,
                      workType: worksParams.workType.filter(
                        w => w !== workTypeObject.data.id
                      ),
                      page: 1,
                    })}
                  >
                    <a>
                      <CancelFilter text={workTypeObject.data.label} />
                    </a>
                  </NextLink>
                );
              })}
              <NextLink
                passHref
                {...worksLink({
                  ...worksParams,
                  workType: null,
                  page: 1,
                  productionDatesFrom: null,
                  productionDatesTo: null,
                  itemsLocationsLocationType: null,
                })}
              >
                <a>
                  <CancelFilter text={'Clear all'} />
                </a>
              </NextLink>
            </Space>
          </div>
        )}
      </Space>
    </>
  );
};

export default SearchFiltersDesktop;
