import { FC, ReactNode } from 'react';
import Caption from '@weco/common/views/components/Caption/Caption';
import styled from 'styled-components';
import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import PrismicImageWithTasl from '../PrismicImageWithTasl/PrismicImageWithTasl';

type CaptionedImageProps = {
  isBody?: boolean;
};

const CaptionedImageFigure = styled.div<CaptionedImageProps>`
  margin: 0;
  display: inline-block;
  width: 100%;
    text-align: center;

  ${props =>
    props.isBody &&
    `
    text-align: left;

    .caption {
      margin-left: 0;
      margin-right: 0;
    }
  `}
}`;

type ImageContainerInnerProps = {
  aspectRatio: number;
};

const ImageContainerInner = styled.div<ImageContainerInnerProps>`
  position: relative;
  max-height: 80vh;
  aspect-ratio: ${props => props.aspectRatio};
  margin: 0 auto;
  @supports not (aspect-ratio: auto) {
    max-width: 90%;
    ${props => props.theme.media.large`
      max-width: ${props.aspectRatio > 1 ? '80%' : '50%'};
    `};
  }
`;

type UiCaptionedImageProps = CaptionedImageType & {
  isBody?: boolean;
  preCaptionNode?: ReactNode;
};

const CaptionedImage: FC<UiCaptionedImageProps> = ({
  caption,
  preCaptionNode,
  image,
  isBody,
}) => {
  const uiImageProps = { ...image };
  return (
    <CaptionedImageFigure isBody={isBody}>
      <ImageContainerInner
        aspectRatio={uiImageProps.width / uiImageProps.height}
      >
        <PrismicImageWithTasl
          image={uiImageProps}
          sizes={{
            xlarge: 1,
            large: 1,
            medium: 1,
            small: 1,
          }}
          quality={75}
        />
        <Caption caption={caption} preCaptionNode={preCaptionNode} />
      </ImageContainerInner>
    </CaptionedImageFigure>
  );
};

export default CaptionedImage;
