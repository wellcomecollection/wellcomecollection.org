// @flow
import { useState, useEffect } from 'react';
// import Router from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { type IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import LL from '../styled/LL';
import Space from '../styled/Space';

const ImageViewerControls = styled.div`
  position: absolute;
  top: 122px;
  left: 12px;
  z-index: 1;
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

const LoadingComponent = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1000',
    }}
  >
    <LL />
  </div>
);

const ZoomedImage = dynamic(() => import('../ZoomedImage/ZoomedImage'), {
  ssr: false,
  loading: LoadingComponent,
});

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
  lang: ?string,
  alt: string,
  urlTemplate: IIIFUriProps => string,
  presentationOnly?: boolean,
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
}: ImageViewerProps) => {
  const [showZoomed, setShowZoomed] = useState(false);
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
      {showZoomed && (
        <ZoomedImage id={id} infoUrl={infoUrl} setShowViewer={setShowZoomed} />
      )}
      <ImageWrapper>
        <ImageViewerControls>
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
          sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`} // TODO specific to MainViewer or single image
          lang={lang}
          alt={presentationOnly ? '' : alt}
          isLazy={false}
          presentationOnly={presentationOnly}
        />
      </ImageWrapper>
    </>
  );
};

export default ImageViewer;
