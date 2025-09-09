import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

const CompositeWrapper = styled.div`
  container-type: inline-size;
  width: 100%;
`;

const CompositeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2cqw;
  width: 100%;
  aspect-ratio: 2 / 3;
  background-color: ${props => props.theme.color('neutral.700')};
  border-radius: 4px;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.color('neutral.300')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.2);
`;

export type Props = {
  images: [Image, Image, Image, Image];
};

const ConceptCompositeImage: FunctionComponent<Props> = ({ images }) => {
  return (
    <CompositeWrapper data-component="concept-composite-image">
      <CompositeGrid>
        {images.map((image, index) => (
          <ImageContainer key={index}>
            <ImageElement
              src={convertImageUri(image.locations[0].url, 250)}
              alt={image.source?.title || 'Collection image'}
              loading="lazy"
            />
          </ImageContainer>
        ))}
      </CompositeGrid>
    </CompositeWrapper>
  );
};

export default ConceptCompositeImage;
