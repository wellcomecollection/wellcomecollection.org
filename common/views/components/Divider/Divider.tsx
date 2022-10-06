import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  color?: PaletteColor;
  isStub?: boolean;
};

const Rule = styled.hr<Props>`
  text-align: left;
  border: 0;
  height: 1px;
  ${props =>
    props.color && `background-color: ${props.theme.color(props.color)};`};

  ${props => props.isStub && 'width: 60px; height: 5px;'}
`;

const Divider: FunctionComponent<Props> = ({
  color = 'warmNeutral.400',
  isStub,
}: Props): ReactElement => <Rule color={color} isStub={isStub} />;

export default Divider;
