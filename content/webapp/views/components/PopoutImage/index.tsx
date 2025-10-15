import { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

// Ensures the image container takes up the same amount of vertical space
// regardless of the image height
const Shim = styled.div`
  position: relative;
  ${props => props.theme.media('medium')`
    height: 0;
    padding-top: 100%;
  `}
`;

const PopoutCardImageContainer = styled.div<{ $aspectRatio?: number }>`
  ${props => props.theme.media('medium')`
    position: absolute;
  `}
  background-color: ${props => props.theme.color('warmNeutral.300')};
  width: 100%;
  padding-top: ${props =>
    props.$aspectRatio ? `${props.$aspectRatio * 66}%` : '100%'};
  bottom: 0;
  transform: rotate(-2deg);
`;

const PopoutCardImage = styled(Space).attrs({
  $v: { size: 'l', properties: ['bottom'] },
})`
  position: absolute;
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = ComponentProps<typeof PrismicImage>;

const PopoutImage: FunctionComponent<Props> = props => {
  const aspectRatio = props.image.height / props.image.width;

  return (
    <Shim>
      <PopoutCardImageContainer
        data-component="popout-image"
        $aspectRatio={aspectRatio}
      >
        <PopoutCardImage>
          <PrismicImage {...props} />
        </PopoutCardImage>
      </PopoutCardImageContainer>
    </Shim>
  );
};

export default PopoutImage;
