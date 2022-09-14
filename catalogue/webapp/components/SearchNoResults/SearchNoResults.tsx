import Space from '@weco/common/views/components/styled/Space';
import { font, grid } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { FunctionComponent } from 'react';

type Props = {
  query: string;
  hasFilters: boolean;
};

const QuerySpan = styled.span.attrs({
  className: font('intb', 2),
})``;

const SearchNoResults: FunctionComponent<Props> = ({
  query,
  hasFilters,
}: Props) => {
  return (
    <Space v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
            <p className={font('intr', 2)}>
              We couldn{`'`}t find anything that matched{' '}
              <QuerySpan>{query}</QuerySpan>
              {hasFilters && (
                <>
                  {' '}
                  <span>with the filters you have selected</span>
                </>
              )}
              . Please try again.
            </p>
          </div>
        </div>
      </div>
    </Space>
  );
};

export default SearchNoResults;
