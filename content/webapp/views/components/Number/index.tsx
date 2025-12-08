import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

type Props = {
  number: number;
  backgroundColor?: PaletteColor;
};

const Wrapper = styled(Space)<{ $backgroundColor?: PaletteColor }>`
  background-color: ${props =>
    props.theme.color(
      props.$backgroundColor ? props.$backgroundColor : 'accent.purple'
    )};

  transform: rotateZ(-6deg);
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 3px;
  text-align: center;
`;

const NumberSpan = styled.span<{ $parentBackgroundColor?: PaletteColor }>`
  color: ${props =>
    props.theme.color(
      props.$parentBackgroundColor === 'yellow' ||
        props.$parentBackgroundColor === 'accent.salmon'
        ? 'black'
        : 'white'
    )};
  transform: rotateZ(6deg) scale(1.2);
`;

const Number: FunctionComponent<Props> = ({
  number,
  backgroundColor,
}: Props): ReactElement<Props> => (
  <Wrapper
    data-component="number"
    as="span"
    className={font('brand', -1)}
    $h={{ size: '2xs', properties: ['margin-left'] }}
    $backgroundColor={backgroundColor}
  >
    <NumberSpan $parentBackgroundColor={backgroundColor}>{number}</NumberSpan>
  </Wrapper>
);

export default Number;
