import { useState, useEffect, Fragment } from 'react';
import NextLink from 'next/link';
import { worksUrl } from '../../../services/catalogue/urls';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import Divider from '@weco/common/views/components/Divider/Divider';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';

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
  workTypeAggregations: CatalogueAggregationBucket[],
  changeHandler: () => void,
|};

const FilterDrawerRefine = ({
  searchForm,
  searchParams,
  workTypeAggregations,
  changeHandler,
}: Props) => {
  const workTypeInUrlArray = searchParams.workType || [];
  const { productionDatesFrom, productionDatesTo, workType } = searchParams;
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);

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
      changeHandler();
    }
  }, [inputDateFrom]);

  useEffect(() => {
    if (
      productionDatesTo !== inputDateTo &&
      (!inputDateTo || (inputDateTo && inputDateTo.match(/^\d{4}$/)))
    ) {
      changeHandler();
    }
  }, [inputDateTo]);

  const filterDrawerItems = [
    {
      title: 'Dates',
      component: (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
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
  ];

  if (workTypeAggregations.length > 0) {
    filterDrawerItems.push({
      title: 'Formats',
      component: (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          {workTypeAggregations &&
            workTypeAggregations.map(type => (
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
                  checked={workTypeInUrlArray.includes(type.data.id)}
                  onChange={event => {
                    changeHandler();
                  }}
                />
              </Space>
            ))}
        </Space>
      ),
    });
  }

  return (
    <div>
      <Space
        v={{
          size: 'l',
          properties: ['margin-top', 'margin-bottom'],
        }}
      >
        <FilterDrawer items={filterDrawerItems} />
      </Space>
      <Space v={{ size: 'l', properties: ['margin-top'] }} className="tokens">
        {(productionDatesFrom ||
          productionDatesTo ||
          workTypeInUrlArray.length > 0) && (
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
              {workTypeAggregations.map(({ data }) => (
                <Fragment key={data.id}>
                  {workType.includes(data.id) && (
                    <NextLink
                      key={data.id}
                      {...worksUrl({
                        ...searchParams,
                        workType: searchParams.workType.filter(
                          w => w !== data.id
                        ),
                        page: 1,
                      })}
                    >
                      <a>
                        <CancelFilter text={data.label} />
                      </a>
                    </NextLink>
                  )}
                </Fragment>
              ))}
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
                <a>
                  <CancelFilter text={'Clear all'} />
                </a>
              </NextLink>
            </Space>
          </div>
        )}
      </Space>
    </div>
  );
};

export default FilterDrawerRefine;
