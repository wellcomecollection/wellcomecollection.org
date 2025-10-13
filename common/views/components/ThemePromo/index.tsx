import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';

// Palette colors for placeholder rectangles
const placeholderColors = [
  'accent.salmon',
  'accent.purple',
  'yellow',
  'accent.green',
];

const Title = styled(Space).attrs({
  className: font('wb', 3),
  as: 'h3',
  $v: { size: 's', properties: ['margin-bottom'] },
})``;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 25rem;
  margin: 0 auto;
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

const ImageContainer = styled.div<{ $placeholderColor?: PaletteColor }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${props =>
    props.$placeholderColor
      ? props.theme.color(props.$placeholderColor)
      : props.theme.color('neutral.300')};
  display: flex;
  align-items: center;
  justify-content: center;
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
  $v: { size: 'm', properties: ['padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  min-height: 30%;
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

export type ThemePromoProps = {
  images: ConceptImagesArray;
  title: string;
  description?: string;
  linkProps: LinkProps;
  dataGtmProps?: DataGtmProps;
};

const ThemePromo: FunctionComponent<ThemePromoProps> = ({
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
    setLoadedImages(prev => new Set(prev).add(index));
  };

  // Create array of slots, some with images, some with placeholder colors
  const slots = Array.from({ length: isSingleImage ? 1 : 4 }, (_, index) => {
    if (index < images.length && images[index]) {
      return {
        type: 'image' as const,
        image: images[index]!,
        color: placeholderColors[
          index % placeholderColors.length
        ] as PaletteColor,
      };
    }
    return {
      type: 'placeholder' as const,
      color: placeholderColors[
        index % placeholderColors.length
      ] as PaletteColor,
    };
  });

  return (
    <Link {...linkProps} {...dataGtmPropsToAttributes(dataGtmProps)}>
      <CardWrapper data-component="theme-promo">
        <CompositeGrid $isSingleImage={isSingleImage}>
          {slots.map((slot, index) => (
            <ImageContainer key={index} $placeholderColor={slot.color}>
              {slot.type === 'image' && slot.image ? (
                <ImageElement
                  src={slot.image}
                  alt=""
                  loading="lazy"
                  $isLoaded={loadedImages.has(index)}
                  onLoad={() => handleImageLoad(index)}
                />
              ) : null}
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

export default ThemePromo;
