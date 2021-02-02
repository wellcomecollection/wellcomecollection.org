import styled from 'styled-components';
import { FunctionComponent } from 'react';

const DotEl = styled.span.attrs({
  'aria-hidden': true,
})`
  font-size: 0.7em;

  &:before {
    content: '⬤';
  }
`;

type Props = {
  color: string;
};

const Dot: FunctionComponent<Props> = ({ color }: Props) => {
  return <DotEl className={`font-${color}`} />;
};

export default Dot;
