import { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Select from '@weco/common/views/components/Select/Select';
import { propsToQuery } from '@weco/common/utils/routes';

const Wrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'margin-top'] },
})`
  ${props => props.theme.media('medium')`
    margin-right: 2rem;
  `}
`;

type Props = {
  formId: string;
  options: Option[];
  jsLessOptions: JsLessOptions;
  defaultValues?: DefaultValuesType;
};

type JsLessOptions = {
  sort: Option[];
  sortOrder: Option[];
};

type Option = {
  value: string;
  text: string;
};

type DefaultValuesType = {
  sort: string | undefined;
  sortOrder: string | undefined;
};

export const getUrlQueryFromSortValue = (sortOptionValue: string): DefaultValuesType=>{
  // The options values are structured like "publication.dates.asc" or "alphabetical.desc"
  // Here we take the last part and split it so we can update the URL query accordingly 
  const valueArray = sortOptionValue.split('.');

  // e.g. "asc" OR "desc"
  const sortOrder = valueArray[valueArray.length - 1];
  
  // e.g. "publication.dates" OR "alphabetical" 
  const sort = valueArray.slice(0, valueArray.length - 1).join('.');

  return { sort, sortOrder };
};

const Sort: FunctionComponent<Props> = ({
  formId,
  options,
  jsLessOptions,
  defaultValues,
}) => {
  const router = useRouter();

  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => setIsComponentMounted(true), []);

  const [sortOrder, setSortOrder] = useState(router?.query?.sortOrder);
  const [sortType, setSortType] = useState(router?.query?.sort);

  useEffect(() => {
    const queryParams = { ...router.query, sortOrder, sort: sortType };
    const newQuery = propsToQuery(queryParams);

    router.push({ pathname: router.pathname, query: newQuery });
  }, [sortOrder, sortType]);

  return (
    <Wrapper>
      <noscript>
        <fieldset>
          <legend className="visually-hidden">Search result sorting</legend>
          <span id="sort-label">Sort by:</span>
          <select
            aria-labelledby="sort-label"
            name="sort"
            form={formId}
            defaultValue={defaultValues?.sort}
          >
            {jsLessOptions.sort.map(o => (
              <option key={o.value} value={o.value}>
                {o.text}
              </option>
            ))}
          </select>
          <br />
          <span id="sort-order-label">Sort order:</span>
          <select
            aria-labelledby="sort-order-label"
            name="sortOrder"
            form={formId}
            defaultValue={defaultValues?.sortOrder}
          >
            {jsLessOptions.sortOrder.map(o => (
              <option key={o.value} value={o.value}>
                {o.text}
              </option>
            ))}
          </select>
          <button type="submit" form={formId}>
            Submit
          </button>
        </fieldset>
      </noscript>

      {isComponentMounted && (
        <Select
          value={sortType + '.' + sortOrder || ''}
          form={formId}
          name="sortOrder"
          label="sort results by:"
          onChange={e => {
            const { sort, sortOrder } = getUrlQueryFromSortValue(e.currentTarget.value);
            setSortOrder(sortOrder);
            setSortType(sort);
          }}
          options={options}
          isPill
          hideLabel
        />
      )}
    </Wrapper>
  );
};

export default Sort;
