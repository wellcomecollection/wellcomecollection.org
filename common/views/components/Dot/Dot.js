// @flow
import styled from 'styled-components';

const DotEl = styled.span.attrs({
  'aria-hidden': true,
})`
  display: inline-block;
  font-size: 0.7em;

  &:before {
    content: '⬤';
  }
`;

type Props = {|
  color: string,
|};

function Dot({ color }: Props) {
  return <DotEl className={`font-${color}`} />;
}

export default Dot;
