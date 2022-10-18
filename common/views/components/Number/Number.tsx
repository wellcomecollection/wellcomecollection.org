import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {
  number: number;
  color?: PaletteColor;
};

const Wrapper = styled(Space)<{ color?: PaletteColor }>`
  background-color: ${props =>
    props.theme.color(props.color ? props.color : 'accent.purple')};

  transform: rotateZ(-6deg);
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 3px;
  text-align: center;
`;

const NumberSpan = styled.span<{ color?: PaletteColor }>`
  color: ${props =>
    props.theme.color(
      props.color === 'yellow' || props.color === 'accent.salmon'
        ? 'black'
        : 'white'
    )};
  transform: rotateZ(6deg) scale(1.2);
`;

const Number: FunctionComponent<Props> = ({
  number,
  color,
}: Props): ReactElement<Props> => (
  <Wrapper
    as="span"
    h={{ size: 's', properties: ['margin-left'] }}
    className={font('wb', 5)}
    color={color}
  >
    <NumberSpan color={color}>{number}</NumberSpan>
  </Wrapper>
);

export default Number;
