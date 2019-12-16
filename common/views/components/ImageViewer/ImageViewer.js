// @flow
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';

const ImageViewerControls = styled.div`
  position: absolute;
  top: 22px;
  left: 73%;
  z-index: 1;
  opacity: ${props => (props.showControls ? 1 : 0)};
  transition: opacity 300ms ease;
  /* TODO: keep an eye on https://github.com/openseadragon/openseadragon/issues/1586
    for a less heavy handed solution to Openseadragon breaking on touch events */
  &,
  button,
  a {
    touch-action: none;
  }

  button {
    display: block;
  }

  .icon {
    margin: 0;
  }

  .btn__text {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
}`;

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
  setZoomInfoUrl: string => void,
  showControls: boolean,
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
  setZoomInfoUrl,
  showControls,
}: ImageViewerProps) => {
  const [rotation, setRotation] = useState(0);
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
        <ImageViewerControls showControls={showControls}>
          <Space
            h={{
              size: 'm',
              properties: ['margin-left', 'margin-right'],
            }}
            v={{ size: 's', properties: ['margin-top'] }}
          >
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <Control
                type="black-on-white"
                text="Zoom in"
                icon="zoomIn"
                clickHandler={() => {
                  setShowZoomed(true);
                  setZoomInfoUrl(infoUrl);
                }}
              />
            </Space>
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <Control
                type="black-on-white"
                text="Rotate"
                icon="rotatePageRight"
                clickHandler={() => {
                  // setImageLoading(true); // TODO
                  setRotation(rotation < 270 ? rotation + 90 : 0);
                }}
              />
            </Space>
          </Space>
        </ImageViewerControls>
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
            setZoomInfoUrl(infoUrl);
          }}
        />
      </ImageWrapper>
    </>
  );
};

export default ImageViewer;
