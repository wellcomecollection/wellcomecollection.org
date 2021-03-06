import {
  useState,
  useEffect,
  useRef,
  useContext,
  FunctionComponent,
  RefObject,
} from 'react';
import styled from 'styled-components';
import { IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import useOnScreen from '@weco/common/hooks/useOnScreen';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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
  urlTemplate: (v: IIIFUriProps) => () => undefined;
  rotation: number;
  loadHandler?: () => void;
  mainAreaRef?: RefObject<HTMLDivElement>;
  index?: number;
  setImageRect: (v: ClientRect) => void;
  setImageContainerRect: (v: ClientRect) => void;
};

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  width,
  height,
  alt,
  infoUrl,
  urlTemplate,
  rotation,
  loadHandler,
  index = 0,
  mainAreaRef,
  setImageRect,
  setImageContainerRect,
}: ImageViewerProps) => {
  const {
    lang,
    setActiveIndex,
    errorHandler,
    setZoomInfoUrl,
    setShowZoomed,
  } = useContext(ItemViewerContext);
  const imageViewer = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    root: mainAreaRef?.current,
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

  function updateImagePosition() {
    const imageRect = imageRef?.current?.getBoundingClientRect();
    const imageContainerRect = imageViewer?.current?.getBoundingClientRect();
    if (imageRect) {
      setImageRect(imageRect);
    }
    if (imageContainerRect) {
      setImageContainerRect(imageContainerRect);
    }
  }

  useEffect(() => {
    updateImagePosition();
    window.addEventListener('resize', updateImagePosition);

    return () => window.removeEventListener('resize', updateImagePosition);
  }, []);

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
        ref={imageRef}
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
        loadHandler={() => {
          updateImagePosition();
        }}
        errorHandler={errorHandler}
      />
    </ImageWrapper>
  );
};

export default ImageViewer;
