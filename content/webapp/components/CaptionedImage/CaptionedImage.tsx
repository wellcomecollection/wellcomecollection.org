import { FC, ReactNode, useRef, RefObject, useState } from 'react';
import Caption from '@weco/common/views/components/Caption/Caption';
import styled from 'styled-components';
import { CaptionedImage as CaptionedImageType } from '@weco/common/model/captioned-image';
import ImageWithTasl from '../ImageWithTasl/ImageWithTasl';
import HeightRestrictedPrismicImage from '@weco/common/views/components/HeightRestrictedPrismicImage/HeightRestrictedPrismicImage';
import Icon from '@weco/common/views/components/Icon/Icon';
import { expand, cross } from '@weco/common/icons';

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
  hasRoundedCorners: boolean;
};

const ImageContainerInner = styled.div<ImageContainerInnerProps>`
  position: relative;
  max-height: 80vh;
  aspect-ratio: ${props => props.aspectRatio};
  margin: 0 auto;

  ${props =>
    props.hasRoundedCorners &&
    `
    > div {
      border-radius:  clamp(10px, 2vw, 26px);
      overflow: hidden;
    }
  `}

  @supports not (aspect-ratio: auto) {
    max-width: 90%;

    ${props =>
      props.theme.media('large')(`
        max-width: ${props.aspectRatio > 1 ? '80%' : '50%'};
      `)};
  }
`;

const ZoomButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  color: ${props => props.theme.color('white')};
  background: ${props => props.theme.color('black')};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  padding: 0;
  margin: 0;
`;

const StyledDialog = styled.dialog`
  border: 0;
  padding: 0;
  max-width: 100%;
  max-height: 100%;
  background: ${props => props.theme.color('black')};

  img {
    width: 100vw;
    height: 100vh;
    display: block;
    object-fit: contain;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
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
  hasRoundedCorners,
}) => {
  const dialogRef: RefObject<HTMLDialogElement> = useRef(null);
  const [didOpenModal, setDidOpenModal] = useState(false);

  function openDialog() {
    dialogRef?.current?.showModal();
    setDidOpenModal(true);
  }

  function closeDialog() {
    dialogRef?.current?.close();
  }
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
    <CaptionedImageFigure isBody={isBody}>
      <ImageContainerInner
        aspectRatio={image.width / image.height}
        hasRoundedCorners={hasRoundedCorners}
      >
        <ZoomButton onClick={openDialog}>
          <Icon icon={expand} color="white" />
        </ZoomButton>
        <ImageWithTasl
          Image={<HeightRestrictedPrismicImage image={image} quality="high" />}
          tasl={image.tasl}
        />
        <Caption caption={caption} preCaptionNode={preCaptionNode} />
      </ImageContainerInner>
      <StyledDialog ref={dialogRef}>
        {didOpenModal && (
          <>
            <ZoomButton onClick={closeDialog}>
              <Icon icon={cross} color="white" />
            </ZoomButton>
            <img src={image.contentUrl} alt={image.alt || ''} />
          </>
        )}
      </StyledDialog>
    </CaptionedImageFigure>
  );
};

export default CaptionedImage;
