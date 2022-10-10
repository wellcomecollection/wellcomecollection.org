import { Fragment, FunctionComponent, ReactNode } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

type Props = {
  color: 'warmNeutral.300' | 'white';
  children: ReactNode;
};

const WobblyBottom: FunctionComponent<Props> = ({ color, children }: Props) => (
  <Wrapper>
    <Fragment>
      {children}
      <WobblyEdge background={color} />
    </Fragment>
  </Wrapper>
);
export default WobblyBottom;
