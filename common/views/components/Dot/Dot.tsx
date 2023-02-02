import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';
import Space from '../styled/Space';

const DotWrapper = styled(Space).attrs({
  as: 'span',
  h: { size: 'xs', properties: ['margin-right'] },
})`
  display: flex;
  align-items: center;
`;

const DotEl = styled.span.attrs({
  'aria-hidden': true,
})<{ dotColor: PaletteColor }>`
  font-size: 0.7em;
  color: ${props => props.theme.color(props.dotColor)};

  &:before {
    content: '⬤';
  }
`;

type Props = {
  dotColor: PaletteColor;
};

const Dot: FunctionComponent<Props> = ({ dotColor }) => (
  <DotWrapper>
    <DotEl dotColor={dotColor} />
  </DotWrapper>
);
export default Dot;
