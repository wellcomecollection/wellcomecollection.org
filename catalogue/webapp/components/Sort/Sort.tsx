import { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import Select from '@weco/common/views/components/Select/Select';
import { propsToQuery } from '@weco/common/utils/routes';
import {
  DefaultSortValuesType,
  getUrlQueryFromSortValue,
} from '@weco/catalogue/utils/search';

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
  defaultValues?: DefaultSortValuesType;
};

type JsLessOptions = {
  sort: Option[];
  sortOrder: Option[];
};

type Option = {
  value: string;
  text: string;
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
      {/* If the user has JavaScript disabled, we only get the values from the form fields. 
      We need two query parameters for sorting, so we have two select inputs. */}
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

      {/* If the user has JavaScript enabled, we can use a sole select input and deal with the logic with JS */}
      {isComponentMounted && (
        <Select
          value={sortType + '.' + sortOrder || ''}
          form={formId}
          name="sortOrder"
          label="sort results by:"
          onChange={e => {
            const { sort, sortOrder } = getUrlQueryFromSortValue(
              e.currentTarget.value
            );
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
