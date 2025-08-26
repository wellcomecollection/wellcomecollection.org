// eslint-data-component: intentionally omitted
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  lineColor?: PaletteColor;
  isStub?: boolean;
};

type StyleProps = {
  $lineColor?: PaletteColor;
  $isStub?: boolean;
};

const Rule = styled.div<StyleProps>`
  text-align: left;
  border: 0;
  height: 1px;
  ${props =>
    props.$lineColor &&
    `background-color: ${props.theme.color(props.$lineColor)};`};

  ${props => props.$isStub && 'width: 60px; height: 5px;'}
`;

const Divider: FunctionComponent<Props> = ({
  lineColor = 'warmNeutral.400',
  isStub,
}: Props): ReactElement => <Rule $lineColor={lineColor} $isStub={isStub} />;

export default Divider;
