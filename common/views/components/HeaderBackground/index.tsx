import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';

type Props = {
  backgroundTexture?: string;
  hasWobblyEdge?: boolean;
  useDefaultBackgroundTexture?: boolean;
};

const defaultBackgroundTexture = landingHeaderBackgroundLs;

const Background = styled.div<{ $texture: string | null }>`
  position: absolute;
  top: 0;
  bottom: 100px;
  width: 100%;
  overflow: hidden;
  z-index: -1;

  background-color: ${props => props.theme.color('warmNeutral.300')};
  ${props =>
    props.$texture &&
    `background-image: url(${props.$texture});
      background-size: cover;`};
`;

const WobblyEdgeContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`;

const HeaderBackground: FunctionComponent<Props> = ({
  backgroundTexture,
  hasWobblyEdge,
  useDefaultBackgroundTexture,
}: Props) => {
  const texture =
    backgroundTexture ||
    (useDefaultBackgroundTexture ? defaultBackgroundTexture : null);

  return (
    <Background $texture={texture}>
      {hasWobblyEdge && (
        <WobblyEdgeContainer>
          <WobblyEdge isValley={true} intensity={100} backgroundColor="white" />
        </WobblyEdgeContainer>
      )}
    </Background>
  );
};

export default HeaderBackground;
