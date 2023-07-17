import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { grid } from '@weco/common/utils/classnames';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import { repeatingLsBlack } from '@weco/common/utils/backgrounds';
import { Container } from '@weco/common/views/components/styled/Container';

const WobblyRowContainer = styled.div`
  position: relative;
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('neutral.700')};
`;

const WobblyRowPattern = styled.div`
  position: absolute;
  background-image: 'url(${repeatingLsBlack})';
  background-repeat: no-repeat;
  background-position: top center;
  opacity: 0.15;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
`;

const WobblyRow: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <WobblyRowContainer>
    <WobblyRowPattern />
    <Container>
      <div className="grid" style={{ marginTop: '50px' }}>
        <div
          className={grid({ s: 12, m: 12, l: 12, xl: 12 })}
          style={{ marginTop: '-50px', position: 'relative' }}
        >
          {children}
        </div>
      </div>
    </Container>
    <WobblyEdge isValley={false} intensity={35} backgroundColor="white" />
  </WobblyRowContainer>
);

export default WobblyRow;
