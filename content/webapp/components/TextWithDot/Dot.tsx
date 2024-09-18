import styled from 'styled-components';

import { PaletteColor } from '@weco/common/views/themes/config';

const Dot = styled.span.attrs({
  'aria-hidden': true,
})<{ $dotColor: PaletteColor }>`
  font-size: 0.7em;
  color: ${props => props.theme.color(props.$dotColor)};

  &::before {
    content: '⬤';
  }
`;

export default Dot;
