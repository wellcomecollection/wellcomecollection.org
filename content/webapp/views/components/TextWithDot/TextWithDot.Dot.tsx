import styled from 'styled-components';

import { ThemeColor } from '@weco/common/views/themes/config';

const Dot = styled.div.attrs({
  'aria-hidden': true,
})<{ $dotColor: ThemeColor }>`
  &::before {
    display: block;
    border: 6px solid;
    border-radius: 50%;
    content: '';
    border-color: ${props => props.theme.color(props.$dotColor)};
  }
`;

export default Dot;
