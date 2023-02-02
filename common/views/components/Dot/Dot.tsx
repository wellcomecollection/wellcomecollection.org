import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';

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
  <DotEl dotColor={dotColor} />
);
export default Dot;
