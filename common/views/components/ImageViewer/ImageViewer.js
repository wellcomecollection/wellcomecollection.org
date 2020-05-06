// @flow
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import { type IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import useOnScreen from '@weco/common/hooks/useOnScreen';

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  img {
    cursor: pointer;
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: auto;
    height: auto;
    max-width: 95%;
    max-height: 95%;
    overflow: scroll; /* for alt text, which can be long */
  }
`;

type ImageViewerProps = {|
  id: string,
  width: number,
  height?: number,
  infoUrl: string,
  lang?: ?string,
  alt: string,
  urlTemplate: IIIFUriProps => Function,
  setShowZoomed: boolean => void,
  setZoomInfoUrl?: string => void,
  setActiveIndex?: number => void,
  rotation: number,
  loadHandler?: Function,
  mainViewerRef?: FixedSizeList,
  index?: number,
|};

const ImageViewer = ({
  id,
  width,
  height,
  lang,
  alt,
  infoUrl,
  urlTemplate,
  setShowZoomed,
  setZoomInfoUrl,
  setActiveIndex,
  rotation,
  loadHandler,
  mainViewerRef,
  index = 0,
}: ImageViewerProps) => {
  const imageViewer = useRef();
  const isOnScreen = useOnScreen({
    root: mainViewerRef && mainViewerRef._outerRef,
    ref: imageViewer,
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
  useEffect(() => {
    if (setActiveIndex && isOnScreen) {
      setActiveIndex(index);
      setZoomInfoUrl && setZoomInfoUrl(infoUrl);
    }
  }, [isOnScreen]);

  useEffect(() => {
    setImageSrc(urlTemplate({ size: '640,', rotation: rotation }));
    setImageSrcSet(
      imageSizes(2048)
        .map(width => {
          const urlString = urlTemplate({
            size: `${width},`,
            rotation: rotation,
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
    <ImageWrapper onLoad={loadHandler} ref={imageViewer}>
      <IIIFResponsiveImage
        tabIndex={0}
        width={width}
        height={height}
        src={imageSrc}
        srcSet={imageSrcSet}
        sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
        lang={lang}
        alt={alt}
        isLazy={false}
        clickHandler={() => {
          setZoomInfoUrl && setZoomInfoUrl(infoUrl);
          setShowZoomed(true);
        }}
      />
    </ImageWrapper>
  );
};

export default ImageViewer;
