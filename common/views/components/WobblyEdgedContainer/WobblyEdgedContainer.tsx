import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Layout8 from '../Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';

const WobblyEdgeContainer = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  children: ReactNode;
};

const WobblyEdgedContainer: FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <Wrapper>
      <WobblyEdgeContainer>
        <WobblyEdge isRotated={true} background="white" />
      </WobblyEdgeContainer>
      <Space v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Layout8>{children}</Layout8>
      </Space>
      <WobblyEdgeContainer>
        <WobblyEdge background="white" />
      </WobblyEdgeContainer>
    </Wrapper>
  );
};
export default WobblyEdgedContainer;
