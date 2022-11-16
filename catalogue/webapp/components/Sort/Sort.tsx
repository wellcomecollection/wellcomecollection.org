import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Select from '@weco/common/views/components/Select/Select';
import { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { propsToQuery } from '@weco/common/utils/routes';

const Wrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'margin-top'] },
})`
  ${props => props.theme.media('medium')`
    margin-right: 2rem;
  `}
`;

type Props = {
  options: Option[];
  jsLessOptions: JsLessOptions;
  form: string;
};

type JsLessOptions = {
  sort?: Option[];
  sortOrder: Option[];
};

type Option = {
  value: string;
  text: string;
};

const Sort: FunctionComponent<Props> = ({ options, jsLessOptions, form }) => {
  const router = useRouter();

  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => setIsComponentMounted(true), []);

  const [sortOrder, setSortOrder] = useState(router.query.sortOrder || '');

  useEffect(() => {
    const sort =
      sortOrder === 'asc' || sortOrder === 'desc'
        ? 'production.dates'
        : undefined;
    const queryParams = { ...router.query, sortOrder, sort };
    const newQuery = propsToQuery(queryParams);

    router.push({ pathname: router.pathname, query: newQuery });
  }, [sortOrder]);

  return (
    <Wrapper>
      <noscript>
        <fieldset>
          <legend className="visually-hidden">Search result sorting</legend>
          {jsLessOptions.sort && (
            <>
              <span id="sort-label">Sort by:</span>
              <select aria-labelledby="sort-label" name="sort" form={form}>
                {jsLessOptions.sort.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.text}
                  </option>
                ))}
              </select>
              <br />
            </>
          )}
          <span id="sort-order-label">Sort order:</span>
          <select
            aria-labelledby="sort-order-label"
            name="sortOrder"
            form={form}
          >
            {jsLessOptions.sortOrder.map(o => (
              <option key={o.value} value={o.value}>
                {o.text}
              </option>
            ))}
          </select>
          <button type="submit" form={form}>
            Submit
          </button>
        </fieldset>
      </noscript>

      {isComponentMounted && (
        <Select
          value={(sortOrder as string) || ''}
          form={form}
          name="sortOrder"
          label="sort results by:"
          onChange={e => setSortOrder(e.currentTarget.value)}
          options={options}
          isPill
          hideLabel
        />
      )}
    </Wrapper>
  );
};

export default Sort;
