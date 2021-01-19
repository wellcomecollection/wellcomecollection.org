import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import Layout8 from '../Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';

const WobblyEdgeContainer = styled.div`
  width: 100%;
`;

type Props = {
  children: ReactNode;
};

const WobblyEdgedContainer: FunctionComponent<Props> = ({
  children,
}: Props) => {
  return (
    <div className="bg-cream relative">
      <WobblyEdgeContainer>
        <WobblyEdge extraClasses="wobbly-edge--rotated" background={'white'} />
      </WobblyEdgeContainer>
      <Space v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Layout8>{children}</Layout8>
      </Space>
      <WobblyEdgeContainer>
        <WobblyEdge background={'white'} />
      </WobblyEdgeContainer>
    </div>
  );
};
export default WobblyEdgedContainer;
