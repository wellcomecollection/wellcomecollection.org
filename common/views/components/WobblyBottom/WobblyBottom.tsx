import { FunctionComponent, ReactNode } from 'react';
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
    {children}
    <WobblyEdge backgroundColor={backgroundColor} />
  </Wrapper>
);
export default WobblyBottom;
