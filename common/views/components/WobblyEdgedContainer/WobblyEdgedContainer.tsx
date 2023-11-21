import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Space from '@weco/common/views/components/styled/Space';
import Layout, { gridSize8 } from '../Layout';

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
      <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Layout gridSizes={gridSize8()}>{children}</Layout>
      </Space>
      <WobblyEdgeContainer>
        <WobblyEdge backgroundColor="white" />
      </WobblyEdgeContainer>
    </Wrapper>
  );
};
export default WobblyEdgedContainer;
