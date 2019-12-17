import { useState, useEffect, Fragment } from 'react';
import NextLink from 'next/link';
import { worksUrl } from '../../../services/catalogue/urls';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import Divider from '@weco/common/views/components/Divider/Divider';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import { allWorkTypes } from '@weco/common/services/data/workTypeAggregations';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';

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
  const { productionDatesFrom, productionDatesTo } = searchParams;
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  // We want to display all currently applied worktypes to the user within the filter drop down
  // This may include worktypes that have no aggregations for the given search
  // We therefore go through all possible worktypes,
  // if they have a matching aggregation from the API response we use that
  // If they aren't included in the API response, but are one of the applied filters,// then we still include it with a count of 0.
  const workTypeFilters = allWorkTypes
    .map(workType => {
      const matchingWorkTypeAggregation = workTypeAggregations.find(
        ({ data }) => workType.data.id === data.id
      );
      const matchingAppliedWorkType = workTypeInUrlArray.find(
        id => workType.data.id === id
      );
      if (matchingWorkTypeAggregation) {
        return matchingWorkTypeAggregation;
      } else if (matchingAppliedWorkType) {
        return workType;
      } else {
        return null;
      }
    })
    .filter(Boolean);

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
        <>
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
        </>
      ),
    },
  ];

  if (workTypeFilters.length > 0) {
    filterDrawerItems.push({
      title: 'Formats',
      component: (
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
        className={classNames({
          flex: true,
        })}
      >
        {filterDrawerItems.map(item => (
          <Space
            h={{ size: 's', properties: ['margin-right'] }}
            key={item.title}
          >
            <DropdownButton buttonText={item.title}>
              {item.component}
            </DropdownButton>
          </Space>
        ))}
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

              {workTypeInUrlArray.map(id => {
                const workTypeObject = workTypeFilters.find(({ data }) => {
                  return data.id === id;
                });
                return (
                  <Fragment key={id}>
                    <NextLink
                      key={workTypeObject.data.id}
                      {...worksUrl({
                        ...searchParams,
                        workType: searchParams.workType.filter(
                          w => w !== workTypeObject.data.id
                        ),
                        page: 1,
                      })}
                    >
                      <a>
                        <CancelFilter text={workTypeObject.data.label} />
                      </a>
                    </NextLink>
                  </Fragment>
                );
              })}
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
