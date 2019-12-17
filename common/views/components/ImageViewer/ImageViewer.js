// @flow
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  transition: opacity 1000ms ease;
  opacity: ${props => (props.imageLoading ? 0 : 1)};
  & img {
    margin: 0 auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 95%;
    overflow: scroll;
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
  presentationOnly?: boolean,
  setShowZoomed: boolean => void,
  rotation: number,
|};

const ImageViewer = ({
  id,
  width,
  height,
  lang,
  alt,
  infoUrl,
  urlTemplate,
  presentationOnly,
  setShowZoomed,
  rotation,
}: ImageViewerProps) => {
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
    <>
      <ImageWrapper>
        <IIIFResponsiveImage
          width={width}
          height={height}
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
          lang={lang}
          alt={presentationOnly ? '' : alt}
          isLazy={false}
          presentationOnly={presentationOnly}
          clickHandler={() => {
            setShowZoomed(true);
          }}
        />
      </ImageWrapper>
    </>
  );
};

export default ImageViewer;
