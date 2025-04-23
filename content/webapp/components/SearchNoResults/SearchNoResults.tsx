import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
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
      <Grid>
        <GridCell
          $sizeMap={{
            s: [12],
            m: [10],
            l: [10],
            xl: [10],
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
      </Grid>
    </Space>
  );
};

export default SearchNoResults;
