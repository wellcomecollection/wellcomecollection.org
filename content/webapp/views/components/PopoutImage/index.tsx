import { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

const PopoutCardImageContainer = styled.div`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  height: 0;
  padding-top: 100%;
  transform: rotate(-2deg);
`;

const PopoutCardImage = styled(Space).attrs({
  $v: { size: 'md', properties: ['bottom'] },
})`
  position: absolute;
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = ComponentProps<typeof PrismicImage>;

const PopoutImage: FunctionComponent<Props> = props => {
  return (
    <PopoutCardImageContainer data-component="popout-image">
      <PopoutCardImage>
        <PrismicImage {...props} />
      </PopoutCardImage>
    </PopoutCardImageContainer>
  );
};

export default PopoutImage;
