import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import Caption from '@weco/common/views/components/Caption';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import HeightRestrictedPrismicImage from '@weco/content/views/components/HeightRestrictedPrismicImage';
import ImageWithTasl, {
  hasLinkedWork as getHasLinkedWork,
} from '@weco/content/views/components/ImageWithTasl';
import ZoomedPrismicImage from '@weco/content/views/components/ZoomedPrismicImage';

const CaptionedImageFigure = styled.figure<{
  $isBody?: boolean;
}>`
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

const ImageContainerInner = styled.div<{
  $aspectRatio: number;
  $hasRoundedCorners: boolean;
}>`
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
  displayWorkLink?: boolean;
};

const CaptionedImage: FunctionComponent<CaptionedImageProps> = ({
  caption,
  preCaptionNode,
  image,
  isBody,
  hasRoundedCorners,
  isZoomable,
  displayWorkLink = true,
}) => {
  const hasLinkedWork = getHasLinkedWork(image.tasl?.sourceLink);
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
          displayWorkLink={displayWorkLink}
        />

        {caption.length > 0 && (
          <ConditionalWrapper
            condition={hasLinkedWork}
            wrapper={children => (
              <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                {children}
              </Space>
            )}
          >
            <Caption caption={caption} preCaptionNode={preCaptionNode} />
          </ConditionalWrapper>
        )}
      </ImageContainerInner>
    </CaptionedImageFigure>
  );
};

export default CaptionedImage;
