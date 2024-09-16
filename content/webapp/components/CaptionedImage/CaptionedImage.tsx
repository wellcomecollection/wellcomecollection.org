import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import Caption from '@weco/common/views/components/Caption/Caption';
import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import ImageWithTasl from '@weco/content/components/ImageWithTasl/ImageWithTasl';
import HeightRestrictedPrismicImage from '@weco/content/components/HeightRestrictedPrismicImage/HeightRestrictedPrismicImage';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import ZoomedPrismicImage from '@weco/content/components/ZoomedPrismicImage/ZoomedPrismicImage';

type CaptionedImageFigureProps = {
  $isBody?: boolean;
};

const CaptionedImageFigure = styled.figure<CaptionedImageFigureProps>`
  margin: 0;
  display: inline-block;
  width: 100%;
  text-align: center;

  ${props =>
    props.$isBody &&
    `
    text-align: left;

    .caption {
      margin-left: 0;
      margin-right: 0;
    }
  `}
`;

type ImageContainerInnerProps = {
  $aspectRatio: number;
  $hasRoundedCorners: boolean;
};

const ImageContainerInner = styled.div<ImageContainerInnerProps>`
  position: relative;
  max-height: 80vh;
  aspect-ratio: ${props => props.$aspectRatio};
  margin: 0 auto;

  ${props =>
    props.$hasRoundedCorners &&
    `
    > div:first-child {
      border-radius:  clamp(10px, 2vw, 26px);
      overflow: hidden;
    }
  `}

  @supports not (aspect-ratio: auto) {
    max-width: 90%;

    ${props =>
      props.theme.media('large')(`
        max-width: ${props.$aspectRatio > 1 ? '80%' : '50%'};
      `)};
  }
`;

export type CaptionedImageProps = CaptionedImageType & {
  isBody?: boolean;
  preCaptionNode?: ReactNode;
};

const CaptionedImage: FunctionComponent<CaptionedImageProps> = ({
  caption,
  preCaptionNode,
  image,
  isBody,
  hasRoundedCorners,
  isZoomable,
}) => {
  // Note: the default quality here was originally 45, but this caused images to
  // appear very fuzzy on stories.
  //
  // I've increased it to 100 because it fixed the immediate problem on a tight
  // deadline, but it may not be the right long-term value -- we should review
  // this and understand (1) why an image in stories wasn't passing a quality here
  // and (2) what the correct default is.
  //
  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1653466941113029

  return (
    <CaptionedImageFigure $isBody={isBody}>
      <ImageContainerInner
        $aspectRatio={image.width / image.height}
        $hasRoundedCorners={hasRoundedCorners}
      >
        {isZoomable && <ZoomedPrismicImage image={image} />}
        <ImageWithTasl
          Image={<HeightRestrictedPrismicImage image={image} quality="high" />}
          tasl={{
            ...image.tasl,
            idSuffix: dasherizeShorten(image.contentUrl),
          }}
        />
        {caption.length > 0 && (
          <Caption caption={caption} preCaptionNode={preCaptionNode} />
        )}
      </ImageContainerInner>
    </CaptionedImageFigure>
  );
};

export default CaptionedImage;
