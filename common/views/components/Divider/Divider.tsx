import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  color: PaletteColor;
  isStub?: boolean;
  isKeyline?: boolean;
  isThin?: boolean;
};

const Rule = styled.hr<Props>`
  text-align: left;
  border: 0;

  ${props =>
    props.color &&
    `
    background-color: ${props.theme.newColor(props.color)};
  `}

  ${props =>
    props.isStub &&
    `
    width: 60px;
    height: 5px;
  `}

  ${props =>
    props.isKeyline &&
    `
    height: 1px;
  `}

  ${props =>
    props.isThin &&
    `
    height: 2px;
  `}
`;

const Divider: FunctionComponent<Props> = ({
  color,
  isStub,
  isKeyline,
  isThin,
}: Props): ReactElement => (
  <Rule color={color} isStub={isStub} isKeyline={isKeyline} isThin={isThin} />
);

export default Divider;
