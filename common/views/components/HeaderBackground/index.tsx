// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  getHeaderTexture,
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { pageBackgroundColor } from '@weco/common/views/themes/config';

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

  background-color: ${props =>
    props.theme.color({ brand: 'neutral.70', legacy: 'warmNeutral.300' })};
  ${props => {
    // In the new brand, headers without a texture get the standard pattern
    const texture =
      props.$texture || (props.theme.brandUpdate ? headerBackgroundLs : null);

    return (
      texture &&
      `background-image: url("${getHeaderTexture(texture, props.theme.brandUpdate)}");
      background-size: cover;`
    );
  }};
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
