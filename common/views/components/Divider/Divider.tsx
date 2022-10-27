import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  borderColor?: PaletteColor;
  isStub?: boolean;
};

const Rule = styled.hr<Props>`
  text-align: left;
  border: 0;
  height: 1px;
  ${props =>
    props.borderColor &&
    `background-color: ${props.theme.color(props.borderColor)};`};

  ${props => props.isStub && 'width: 60px; height: 5px;'}
`;

const Divider: FunctionComponent<Props> = ({
  borderColor = 'warmNeutral.400',
  isStub,
}: Props): ReactElement => <Rule borderColor={borderColor} isStub={isStub} />;

export default Divider;
