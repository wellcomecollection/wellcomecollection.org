import { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

const BookCardImageContainer = styled.div`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  height: 0;
  padding-top: 100%;
  transform: rotate(-2deg);
`;

const BookCardImage = styled(Space)`
  position: absolute;
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = ComponentProps<typeof PrismicImage>;

const BookImage: FunctionComponent<Props> = props => {
  return (
    <BookCardImageContainer data-component="book-image">
      <BookCardImage $v={{ size: 'l', properties: ['bottom'] }}>
        <PrismicImage {...props} />
      </BookCardImage>
    </BookCardImageContainer>
  );
};

export default BookImage;
