import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {
  number: number;
  color?: string;
};

const Wrapper = styled(Space)<{ color?: string }>`
  background-color: ${props =>
    props.theme.color(props.color ? props.color : 'accent.purple')};

  transform: rotateZ(-6deg);
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 3px;
  text-align: center;
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
    <span
      className={
        color === 'yellow' || color === 'accent.salmon'
          ? 'font-black'
          : 'font-white'
      }
      style={{ transform: 'rotateZ(6deg) scale(1.2)' }}
    >
      {number}
    </span>
  </Wrapper>
);

export default Number;
