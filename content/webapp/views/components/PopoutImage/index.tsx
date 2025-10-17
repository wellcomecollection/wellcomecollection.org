import { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';

export const PopoutCardImageContainer = styled.div`
  display: block;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90%;
    background-color: ${props => props.theme.color('neutral.300')};
    transform: rotate(-2deg);
    z-index: -1;
  }

  img {
    display: block;
    margin: auto;
    width: 66%;
    height: auto;
    padding-bottom: ${props => `${props.theme.gutter.medium}px`};
  }
`;

type Props = ComponentProps<typeof PrismicImage>;

const PopoutImage: FunctionComponent<Props> = props => {
  return (
    <PopoutCardImageContainer data-component="popout-image">
      <PrismicImage {...props} />
    </PopoutCardImageContainer>
  );
};

export default PopoutImage;
