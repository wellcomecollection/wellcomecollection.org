import { Fragment, FunctionComponent, ReactNode } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

type Props = {
  backgroundColor: 'warmNeutral.300' | 'white';
  children: ReactNode;
};

const WobblyBottom: FunctionComponent<Props> = ({
  backgroundColor,
  children,
}: Props) => (
  <Wrapper>
    <Fragment>
      {children}
      <WobblyEdge backgroundColor={backgroundColor} />
    </Fragment>
  </Wrapper>
);
export default WobblyBottom;
