// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { pageBackgroundColor } from '@weco/common/views/themes/config';

type Props = {
  backgroundTexture?: string;
  hasWobblyEdge?: boolean;
  useDefaultBackgroundTexture?: boolean;
};

const Background = styled.div<{ $texture: string | null }>`
  position: absolute;
  top: 0;
  bottom: 100px;
  width: 100%;
  overflow: hidden;
  z-index: -1;

  background-color: ${props => props.theme.color('neutral.70')};

  /* Headers without a texture get the standard pattern */
  background-image: url('${props => props.$texture || headerBackgroundLs}');
  background-size: cover;
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
    (useDefaultBackgroundTexture ? headerBackgroundLs : null);

  return (
    <Background $texture={texture}>
      {hasWobblyEdge && (
        <WobblyEdgeContainer>
          <DecorativeEdge
            variant="wobbly"
            intensity={100}
            backgroundColor={pageBackgroundColor}
            isValley
          />
        </WobblyEdgeContainer>
      )}
    </Background>
  );
};

export default HeaderBackground;
