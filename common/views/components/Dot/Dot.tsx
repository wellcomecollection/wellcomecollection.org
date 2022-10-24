import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';

const DotEl = styled.span.attrs({
  'aria-hidden': true,
})<{ color: PaletteColor }>`
  font-size: 0.7em;
  color: ${props => props.theme.color(props.color)};

  &:before {
    content: '⬤';
  }
`;

type Props = {
  color: PaletteColor;
};

const Dot: FunctionComponent<Props> = ({ color }) => <DotEl color={color} />;
export default Dot;
