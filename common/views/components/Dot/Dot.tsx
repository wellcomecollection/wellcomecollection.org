import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { classNames } from '@weco/common/utils/classnames';

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
  return <DotEl className={classNames({ [`font-${color}`]: true })} />;
};

export default Dot;
