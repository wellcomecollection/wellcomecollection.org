import Space from '@weco/common/views/components/styled/Space';
import { font, grid } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  query: string;
  hasFilters: boolean;
  color?: PaletteColor;
};

const QuerySpan = styled.span.attrs({
  className: font('intb', 2),
})``;

const Copy = styled.p.attrs({ className: font('intr', 2) })<{
  color?: PaletteColor;
}>`
  ${props => props.color && `color: ${props.theme.color(props.color)};`};
`;

const SearchNoResults: FunctionComponent<Props> = ({
  query,
  hasFilters,
  color,
}: Props) => {
  return (
    <Space v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
            <Copy color={color}>
              We couldn&rsquo;t find anything that matched{' '}
              <QuerySpan>{query}</QuerySpan>
              {hasFilters && (
                <>
                  {' '}
                  <span>with the filters you have selected</span>
                </>
              )}
              . Please try again.
            </Copy>
          </div>
        </div>
      </div>
    </Space>
  );
};

export default SearchNoResults;
