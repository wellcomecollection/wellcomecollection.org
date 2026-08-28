import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Space from '@weco/common/views/components/styled/Space';
import { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import type { ColorSelection } from '@weco/content/types/color-selections';
import { placeholderBackgroundColor } from '@weco/content/views/components/ImagePlaceholder';

const Title = styled(Space).attrs({
  className: typography('heading', 'lg', 'regular', 'brand'),
  as: 'h3',
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  display: block;
  color: ${props => props.theme.color('white')};
  container-type: inline-size;
  cursor: pointer;

  &:hover ${Title} {
    text-decoration: underline;
  }
`;

const CompositeGrid = styled.div<{ $isSingleImage?: boolean }>`
  display: grid;
  grid-template-columns: ${props => (props.$isSingleImage ? '1fr' : '1fr 1fr')};
  grid-template-rows: ${props => (props.$isSingleImage ? '1fr' : '1fr 1fr')};
  gap: ${props => (props.$isSingleImage ? '0' : '2cqw')};
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
  background-color: ${props => props.theme.color('neutral.700')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderBlock = styled.div<{ $colorKey: ColorSelection }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.color(props.$colorKey)};
`;

const ImageElement = styled.img<{ $isLoaded?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.2);
  opacity: ${props => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.7s ease-in-out;
`;

const TextContent = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
})`
  min-height: 30%;
  padding-top: 4rem;
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

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
  className: typography('body', 'md', 'regular'),
})`
  margin-bottom: 0;
`;

export type ImageGridCardProps = {
  images: ConceptImagesArray;
  title: string;
  description?: string;
  linkProps: LinkProps;
  dataGtmProps?: DataGtmProps;
};

const ImageGridCard: FunctionComponent<ImageGridCardProps> = ({
  images,
  title,
  description,
  linkProps,
  dataGtmProps,
}) => {
  const imageCount = images.filter(Boolean).length;
  const isSingleImage = imageCount === 1;

  // Track which images have loaded
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    // Bail out (same reference, no re-render) once already marked loaded -
    // otherwise the inline ref below gets reattached on every render it
    // triggers, calling this again and looping forever.
    setLoadedImages(prev =>
      prev.has(index) ? prev : new Set(prev).add(index)
    );
  };

  // Create array of slots, some with images
  const slots = Array.from({ length: isSingleImage ? 1 : 4 }, (_, index) => {
    if (index < images.length && images[index]) {
      return {
        type: 'image' as const,
        image: images[index]!,
      };
    }
    return {
      type: 'placeholder' as const,
    };
  });

  return (
    <Link
      style={{ display: 'block' }}
      {...linkProps}
      {...dataGtmPropsToAttributes(dataGtmProps)}
    >
      <CardWrapper data-component="image-grid-card">
        <CompositeGrid $isSingleImage={isSingleImage}>
          {slots.map((slot, index) => (
            <ImageContainer key={index}>
              {slot.type === 'image' && slot.image ? (
                <ImageElement
                  src={slot.image}
                  alt=""
                  loading="lazy"
                  $isLoaded={loadedImages.has(index)}
                  onLoad={() => handleImageLoad(index)}
                  // If the browser already has this image cached, it can
                  // finish loading before this ref (and so onLoad) is even
                  // attached - the load event fires and is missed, leaving
                  // $isLoaded stuck false forever. .complete catches that.
                  ref={img => {
                    if (img?.complete) handleImageLoad(index);
                  }}
                />
              ) : (
                <PlaceholderBlock
                  $colorKey={placeholderBackgroundColor(index)}
                />
              )}
            </ImageContainer>
          ))}
        </CompositeGrid>

        <TextContent>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </TextContent>
      </CardWrapper>
    </Link>
  );
};

export default ImageGridCard;
