import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

const CardWrapper = styled.a`
  position: relative;
  width: 100%;
  display: block;
  color: ${props => props.theme.color('white')};
  container-type: inline-size;

  &:hover h3 {
    text-decoration: underline;
  }
`;

const CompositeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2cqw;
  width: 100%;
  aspect-ratio: 2 / 3;
  background-color: ${props => props.theme.color('neutral.700')};
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

const TextContent = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  padding-top: 4rem;
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  right: 0;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* stylelint-disable color-function-notation, color-function-alias-notation */
    background: linear-gradient(
      to top,
      rgba(50, 50, 50, 1) 0%,
      rgba(50, 50, 50, 1) calc(100% - 5rem),
      transparent 100%
    );
    /* stylelint-enable color-function-notation, color-function-alias-notation */
  }
`;

const Description = styled.p.attrs({
  className: font('intr', 5),
})`
  margin-bottom: 0;
`;

export type ConceptCardProps = {
  images: [Image, Image, Image, Image];
  title: string;
  description: string;
  url: string;
};

const ConceptCard: FunctionComponent<ConceptCardProps> = ({
  images,
  title,
  description,
  url,
}) => {
  return (
    <CardWrapper data-component="concept-card" href={url}>
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
      <TextContent>
        <h3 className={font('wb', 3)}>{title}</h3>
        <Description>{description}</Description>
      </TextContent>
    </CardWrapper>
  );
};

export default ConceptCard;
