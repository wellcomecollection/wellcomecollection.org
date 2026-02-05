import Router from 'next/router';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useOnScreen from '@weco/content/hooks/useOnScreen';
import useSkipInitialEffect from '@weco/content/hooks/useSkipInitialEffect';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

import { arrayIndexToQueryParam, queryParamToArrayIndex } from '.';
import IIIFViewerImage from './IIIFViewerImage';

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 20px;
  padding: 0;

  img {
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: auto;
    height: auto;
    max-width: 80%;
    max-height: 95%;
    overflow: scroll; /* for alt text, which can be long */
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
  const {
    work,
    errorHandler,
    setShowZoomed,
    mainAreaRef,
    query,
    rotatedImages,
    useFixedSizeList,
    transformedManifest,
  } = useItemViewerContext();
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    root: mainAreaRef?.current || undefined,
    ref: imageWrapperRef || undefined,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  });
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

  /**
   * Updates the URL to match the visible canvas when scrolling through images.
   *
   * Context:
   * - On /works/{id}/items pages: transformedManifest exists, useFixedSizeList varies
   * - On /works/{id}/images?id={imageId} pages: no transformedManifest, single image view
   *
   * This effect only runs when ALL conditions are met:
   * 1. useFixedSizeList: Using scrollable image grid (not paginated file list)
   * 2. isOnScreen: Current canvas has scrolled into view
   * 3. transformedManifest: Full manifest exists (not single image page)
   *
   * Without the transformedManifest check, single image pages would incorrectly
   * redirect to the work detail page on load.
   */
  useSkipInitialEffect(() => {
    // Only update URL when we have all three conditions:
    const shouldUpdateUrl =
      useFixedSizeList && isOnScreen && transformedManifest !== undefined;

    if (shouldUpdateUrl) {
      const link = toWorksItemLink({
        workId: work.id,
        props: {
          manifest: query.manifest,
          query: query.query,
          canvas: arrayIndexToQueryParam(index),
          shouldScrollToCanvas: false,
        },
      });
      Router.replace(link.href);
    }
  }, [isOnScreen]);

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
    <ImageWrapper onLoad={loadHandler} ref={imageWrapperRef}>
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
        alt={alt}
        clickHandler={() => {
          setShowZoomed(true);
        }}
        loadHandler={() => {
          updateImagePosition();
        }}
        errorHandler={errorHandler}
        zoomOnClick={true}
      />
    </ImageWrapper>
  );
};

export default ImageViewer;
