// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';

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
  isolation: isolate;

  background-color: ${props => props.theme.color('warmNeutral.300')};

  ${props =>
    props.$texture &&
    `&::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: url(${props.$texture});
      background-size: cover;

      @media (prefers-color-scheme: dark) {
        filter: invert(1);
      }
    }`};
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
          <DecorativeEdge
            variant="wobbly"
            isValley={true}
            intensity={100}
            backgroundColor="white"
          />
        </WobblyEdgeContainer>
      )}
    </Background>
  );
};

export default HeaderBackground;
