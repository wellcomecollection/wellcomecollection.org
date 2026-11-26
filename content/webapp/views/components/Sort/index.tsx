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
  ${props => props.theme.media('sm')`
    margin-right: 2rem;
  `}
`;

type Props = {
  formId: string;
  options: Option[];
  jsLessOptions: JsLessOptions;
  defaultValues?: DefaultSortValuesType;
  // Overrides which option is shown as selected, which otherwise comes from
  // the URL. Needed where the page fills in or corrects the sort: e.g.
  // ?sort=production.dates has no sortOrder, so it matches no option, but
  // the page sorts newest first and this should show "Newest to oldest"
  selectedValue?: string;
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
  selectedValue,
  darkBg,
}) => {
  const router = useRouter();
  const { isEnhanced } = useAppContext();
  const { sortOrder: currentSortOrder, sort: currentSortType } = router.query;

  // The option just chosen, shown until the route change for it finishes
  const [pendingValue, setPendingValue] = useState<string>();

  useEffect(() => {
    setPendingValue(undefined);
  }, [currentSortOrder, currentSortType]);

  const valueFromQuery = currentSortType
    ? `${currentSortType}.${currentSortOrder}`
    : '';
  // Which option the select shows, most specific source first: the choice just
  // made, then the sort the page resolved, then whatever's in the URL. Taking it
  // from the URL rather than state is what keeps the select in step through the
  // browser's Back and Forward
  const shownValue = pendingValue ?? selectedValue ?? valueFromQuery;

  const changeSort = (value: string) => {
    if (value === shownValue) return;

    setPendingValue(value);
    const { sort, sortOrder } = getUrlQueryFromSortValue(value);
    const newQuery = propsToQuery({ ...router.query, sortOrder, sort });

    // Reset pagination when we change the sort order
    // as it's likely the user will want to start from page 1
    const { page, ...rest } = newQuery;
    router.push({ pathname: router.pathname, query: { ...rest } });
  };

  return (
    <Wrapper data-component="sort">
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
          value={shownValue}
          form={formId}
          name="sortOrder"
          label="sort results by:"
          onChange={e => changeSort(e.currentTarget.value)}
          options={options}
          darkBg={darkBg}
          isPill
          hideLabel
        />
      )}
    </Wrapper>
  );
};

export default Sort;
