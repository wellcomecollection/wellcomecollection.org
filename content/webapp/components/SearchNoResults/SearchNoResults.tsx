import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { GridCell } from '@weco/common/views/components/styled/GridCell';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  query?: string;
  hasFilters?: boolean;
};

const QuerySpan = styled.span.attrs({
  className: font('intb', 2),
})``;

const SearchNoResults: FunctionComponent<Props> = ({
  query,
  hasFilters,
}: Props) => {
  return (
    <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <div className="grid">
        <GridCell
          $sizeMap={{
            s: ['auto', 12],
            m: ['auto', 10],
            l: ['auto', 10],
            xl: ['auto', 10],
          }}
        >
          <p data-testid="search-no-results" className={font('intr', 2)}>
            We couldn&rsquo;t find anything that matched{' '}
            {query ? <QuerySpan>{query}</QuerySpan> : 'your search'}
            {hasFilters ? ' with the filters you have selected.' : '.'}
          </p>
          <p className={font('intr', 3)} style={{ maxWidth: '800px' }}>
            Please adjust your search terms and try again. If you think this
            search should show some results, please email{' '}
            <a href="mailto:digital@wellcomecollection.org">
              digital@wellcomecollection.org
            </a>
            .
          </p>
        </GridCell>
      </div>
    </Space>
  );
};

export default SearchNoResults;
