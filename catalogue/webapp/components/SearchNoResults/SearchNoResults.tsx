import Space from '@weco/common/views/components/styled/Space';
import { font, grid } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  query?: string;
  hasFilters?: boolean;
  textColor?: PaletteColor;
};

const QuerySpan = styled.span.attrs({
  className: font('intb', 2),
})``;

const Copy = styled.p.attrs({ className: font('intr', 2) })<{
  textColor?: PaletteColor;
}>`
  ${props =>
    props.textColor && `color: ${props.theme.color(props.textColor)};`};
`;

const SearchNoResults: FunctionComponent<Props> = ({
  query,
  hasFilters,
  textColor,
}: Props) => {
  return (
    <Space v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <div className="grid">
        <div className={grid({ s: 12, m: 10, l: 8, xl: 8 })}>
          <Copy data-test-id="search-no-results" textColor={textColor}>
            We couldn&rsquo;t find anything that matched{' '}
            {query ? <QuerySpan>{query}</QuerySpan> : 'your search'}
            {hasFilters ? ' with the filters you have selected.' : '.'}
          </Copy>
          <Copy>
            Please adjust your search terms and try again. If you think this
            search should show some results, please email{' '}
            <a href="mailto:digital@wellcomecollection.org">
              digital@wellcomecollection.org
            </a>
          </Copy>
        </div>
      </div>
    </Space>
  );
};

export default SearchNoResults;
