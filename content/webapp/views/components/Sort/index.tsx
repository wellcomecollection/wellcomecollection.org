import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { propsToQuery } from '@weco/common/utils/routes';
import {
  DefaultSortValuesType,
  getUrlQueryFromSortValue,
} from '@weco/common/utils/search';
import { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import Select from '@weco/content/views/components/Select';

const Wrapper = styled(Space)`
  ${props => props.theme.media('medium')`
    margin-right: 2rem;
  `}
`;

type Props = {
  formId: string;
  options: Option[];
  jsLessOptions: JsLessOptions;
  defaultValues?: DefaultSortValuesType;
  darkBg?: boolean;
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
  darkBg,
}) => {
  const router = useRouter();
  const { isEnhanced } = useAppContext();
  const { sortOrder: currentSortOrder, sort: currentSortType } = router.query;

  const [sortOrder, setSortOrder] = useState(currentSortOrder);
  const [sortType, setSortType] = useState(currentSortType);

  useEffect(() => {
    // Only push changes if the sort order is a new one than currently used
    if (sortOrder !== currentSortOrder || sortType !== currentSortType) {
      const queryParams = { ...router.query, sortOrder, sort: sortType };
      const newQuery = propsToQuery(queryParams);

      // Reset pagination when we change the sort order
      // as it's likely the user will want to start from page 1
      const { page, ...rest } = newQuery;
      router.push({ pathname: router.pathname, query: { ...rest } });
    }
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
          <button type={ButtonTypes.submit} form={formId}>
            Submit
          </button>
        </fieldset>
      </noscript>

      {/* If the user has JavaScript enabled, we can use a sole select input and deal with the logic with JS */}
      {isEnhanced && (
        <Select
          value={sortType ? sortType + '.' + sortOrder : ''}
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
          darkBg={darkBg}
        />
      )}
    </Wrapper>
  );
};

export default Sort;
