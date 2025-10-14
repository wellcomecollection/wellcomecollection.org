import { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

// Ensures the image areatakes up the same amount of vertical space
// regardless of image height
const Shim = styled.div`
  height: 0;
  padding-top: 100%;
  position: relative;
`;

const BookCardImageContainer = styled.div<{ $aspectRatio?: number }>`
  position: absolute;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  width: 100%;
  padding-top: ${props =>
    props.$aspectRatio ? `${props.$aspectRatio * 66}%` : '100%'};
  bottom: 0;
  transform: rotate(-2deg);
`;

const BookCardImage = styled(Space).attrs({
  $v: { size: 'l', properties: ['bottom'] },
})`
  position: absolute;
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = ComponentProps<typeof PrismicImage>;

const BookImage: FunctionComponent<Props> = props => {
  const aspectRatio = props.image.height / props.image.width;

  return (
    <Shim>
      <BookCardImageContainer
        data-component="book-image"
        $aspectRatio={aspectRatio}
      >
        <BookCardImage>
          <PrismicImage {...props} />
        </BookCardImage>
      </BookCardImageContainer>
    </Shim>
  );
};

export default BookImage;
