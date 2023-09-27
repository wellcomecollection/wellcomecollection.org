import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';

const WobblyEdgeContainer = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const WobblyEdgedContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <Wrapper>
      <WobblyEdgeContainer>
        <WobblyEdge isRotated={true} backgroundColor="white" />
      </WobblyEdgeContainer>
      <Space v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Layout8>{children}</Layout8>
      </Space>
      <WobblyEdgeContainer>
        <WobblyEdge backgroundColor="white" />
      </WobblyEdgeContainer>
    </Wrapper>
  );
};
export default WobblyEdgedContainer;
