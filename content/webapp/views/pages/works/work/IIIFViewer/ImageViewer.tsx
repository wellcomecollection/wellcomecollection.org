import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import { queryParamToArrayIndex } from '.';
import IIIFViewerImage from './IIIFViewerImage';

const ImageWrapper = styled.div<{
  $isFullSupportBrowser: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 20px;
  padding: 0;

  img {
    margin: 10px auto;
    overflow: scroll; /* for alt text, which can be long */
    width: unset;
    height: revert-layer;
    display: block;

    ${props =>
      props.$isFullSupportBrowser &&
      `
      position: relative;
      top: 50%;
      width: auto;
      height: auto;
      transform: translateY(-50%);
      max-width: 80%;
      max-height: 95%;
    `}
  }
`;

type ImageViewerProps = {
  id: string;
  width: number;
  height?: number;
  infoUrl: string;
  alt: string;
  urlTemplate: (v: IIIFUriProps) => string;
  loadHandler?: () => void;
  index: number;
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
};

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  width,
  height,
  alt,
  infoUrl,
  urlTemplate,
  loadHandler,
  index,
  setImageRect,
  setImageContainerRect,
}) => {
  const { isFullSupportBrowser } = useAppContext();
  const { work, errorHandler, setShowZoomed, rotatedImages } =
    useItemViewerContext();
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState(urlTemplate({ size: '640,' }));
  const [imageSrcSet, setImageSrcSet] = useState(
    imageSizes(2048)
      .map(width => {
        const urlString = urlTemplate({
          size: `${width},`,
        });

        return urlString && `${urlString} ${width}w`;
      })
      .join(',')
  );
  const matching = rotatedImages.find(
    canvas => queryParamToArrayIndex(canvas.canvas) === index
  );

  const rotation = matching ? matching.rotation : 0;

  function updateImagePosition() {
    const imageRect = imageRef?.current?.getBoundingClientRect();
    const imageContainerRect =
      imageWrapperRef?.current?.getBoundingClientRect();
    if (imageRect) {
      setImageRect && setImageRect(imageRect);
    }
    if (imageContainerRect) {
      setImageContainerRect && setImageContainerRect(imageContainerRect);
    }
  }

  useEffect(() => {
    updateImagePosition();
    window.addEventListener('resize', updateImagePosition);

    return () => window.removeEventListener('resize', updateImagePosition);
  }, []);

  useEffect(() => {
    setImageSrc(urlTemplate({ size: '640,', rotation }));
    setImageSrcSet(
      imageSizes(2048)
        .map(width => {
          const urlString = urlTemplate({
            size: `${width},`,
            rotation,
          });
          return urlString && `${urlString} ${width}w`;
        })
        .join(',')
    );
  }, [infoUrl, rotation]);

  const escapeCloseViewer = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) {
      setShowZoomed(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escapeCloseViewer);
    return () => {
      document.removeEventListener('keydown', escapeCloseViewer);
    };
  }, []);

  return (
    <ImageWrapper
      onLoad={loadHandler}
      ref={imageWrapperRef}
      $isFullSupportBrowser={isFullSupportBrowser}
    >
      <IIIFViewerImage
        index={index}
        ref={imageRef}
        tabIndex={0}
        width={width}
        src={imageSrc}
        height={height}
        srcSet={imageSrcSet}
        sizes="(min-width: 860px) 800px, calc(92.59vw + 22px)"
        lang={work.languageId}
        aria-labelledby={`image-${index}`}
        alt=""
        clickHandler={() => {
          setShowZoomed(true);
        }}
        loadHandler={() => {
          updateImagePosition();
        }}
        errorHandler={errorHandler}
        zoomOnClick={true}
      />
      <span className="visually-hidden" id={`image-${index}`}>
        {alt}
      </span>
    </ImageWrapper>
  );
};

export default ImageViewer;
