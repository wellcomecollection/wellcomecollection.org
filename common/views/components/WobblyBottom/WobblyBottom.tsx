import { FunctionComponent, PropsWithChildren } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

type Props = PropsWithChildren<{
  backgroundColor: 'warmNeutral.300' | 'white';
}>;

const WobblyBottom: FunctionComponent<Props> = ({
  backgroundColor,
  children,
}) => (
  <Wrapper>
    {children}
    <WobblyEdge backgroundColor={backgroundColor} />
  </Wrapper>
);
export default WobblyBottom;
