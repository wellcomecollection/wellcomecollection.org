import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';
import Layout from '@weco/common/views/components/Layout/Layout';

type Props = {
  query: string;
  hasFilters: boolean;
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
      <Layout gridSizes={{ s: 12, m: 10, l: 8, xl: 8 }}>
        <Copy textColor={textColor}>
          We couldn&rsquo;t find anything that matched{' '}
          <QuerySpan>{query}</QuerySpan>
          {hasFilters && (
            <> with the filters you have selected. Please try again.</>
          )}
        </Copy>
      </Layout>
    </Space>
  );
};

export default SearchNoResults;
