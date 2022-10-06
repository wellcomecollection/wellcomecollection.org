import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  color?: PaletteColor;
  variant?: 'stub' | 'thick';
};

const Rule = styled.hr<Props>`
  text-align: left;
  border: 0;
  height: 1px;
  ${props =>
    props.color && `background-color: ${props.theme.color(props.color)};`};

  // Variants
  ${props => props.variant === 'stub' && 'width: 60px; height: 5px;'}

  ${props => props.variant === 'thick' && 'height: 2px;'}
`;

const Divider: FunctionComponent<Props> = ({
  color = 'warmNeutral.400',
  variant,
}: Props): ReactElement => <Rule color={color} variant={variant} />;

export default Divider;
