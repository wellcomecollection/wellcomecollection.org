import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { typography } from '@weco/common/utils/classnames';
import { IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import { appendQueryParam } from '@weco/common/utils/urls';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/work.helpers';

import IIIFViewerImage from './IIIFViewerImage';

// After this many failed attempts to load the image (each retried with a
// cache-busting query param, in case a refreshed auth cookie fixes it) we
// stop retrying and show a message instead of hammering the auth iframe.
const MAX_RETRIES = 3;

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

const ImageErrorMessage = styled.p.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  text-align: center;
  color: ${props => props.theme.color('white')};
`;

type ImageViewerProps = {
  id: string;
  width: number;
  height?: number;
  imageUrl: string;
  alt: string;
  urlTemplate: (v: IIIFUriProps) => string;
  loadHandler?: () => void;
  index: number;
  setImageRect?: (v: DOMRect) => void;
  setImageContainerRect?: (v: DOMRect) => void;
  isRestricted?: boolean;
};

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  width,
  height,
  alt,
  imageUrl,
  urlTemplate,
  loadHandler,
  index,
  setImageRect,
  setImageContainerRect,
  isRestricted,
}) => {
  const { isFullSupportBrowser } = useAppContext();
  const { work, errorHandler, setShowZoomed, rotatedImages } =
    useItemViewerContext();
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const matching = rotatedImages.find(
    canvas => queryParamToArrayIndex(canvas.canvas) === index
  );
  const rotation = matching ? matching.rotation : 0;

  // Bumped on every failed load (see errorHandler below)
  // so the src below changes on each retry
  const [retryCount, setRetryCount] = useState(0);
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false);
  const withCacheBust = (url: string) =>
    retryCount > 0 ? appendQueryParam(url, 'retry', String(retryCount)) : url;

  const buildImageSrc = () =>
    withCacheBust(urlTemplate({ size: '640,', rotation }));
  const buildImageSrcSet = () =>
    imageSizes(2048)
      .map(width => {
        const urlString = urlTemplate({ size: `${width},`, rotation });
        return urlString && `${withCacheBust(urlString)} ${width}w`;
      })
      .join(',');

  const [imageSrc, setImageSrc] = useState(buildImageSrc());
  const [imageSrcSet, setImageSrcSet] = useState(buildImageSrcSet());

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

  // A new image (or rotation) means a fresh set of retries
  useEffect(() => {
    setRetryCount(0);
    setHasFailedToLoad(false);
  }, [imageUrl, rotation]);

  useEffect(() => {
    setImageSrc(buildImageSrc());
    setImageSrcSet(buildImageSrcSet());
  }, [imageUrl, rotation, retryCount]);

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
      {hasFailedToLoad ? (
        <ImageErrorMessage>
          Sorry, this image could not be loaded. Please try refreshing the page.
        </ImageErrorMessage>
      ) : (
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
          ariaDescribedBy={alt ? `image-${index + 1}` : undefined}
          alt={`digitised image ${index + 1}`}
          isRestricted={isRestricted}
          clickHandler={() => {
            setShowZoomed(true);
          }}
          loadHandler={() => {
            updateImagePosition();
          }}
          errorHandler={() => {
            setRetryCount(count => {
              if (count >= MAX_RETRIES) {
                setHasFailedToLoad(true);
                return count;
              }
              errorHandler?.();
              return count + 1;
            });
          }}
          zoomOnClick
        />
      )}
      {alt ? (
        <span className="visually-hidden" id={`image-${index + 1}`}>
          {alt}
        </span>
      ) : null}
    </ImageWrapper>
  );
};

export default ImageViewer;
