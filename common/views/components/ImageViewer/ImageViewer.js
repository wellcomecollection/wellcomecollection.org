// @flow
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { type IiifUriOpts } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '../styled/LL';
import { imageSizes } from '../../../utils/image-sizes';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';

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

const ImageViewerControls = styled.div`
  position: absolute;
  bottom: 36px;
  left: 65vw;
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
      max-height: 100%;
      overflow: scroll;
    }
  }
`;

type ImageViewerProps = {|
  id: string,
  width: number,
  height?: number,
  infoUrl: string,
  lang: ?string,
  alt: string,
  urlTemplate: IiifUriOpts => string,
  presentationOnly?: boolean,
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
  rotation,
}: ImageViewerProps) => {
  const [showViewer, setShowViewer] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    urlTemplate && urlTemplate({ size: '640,' })
  );

  const [imageSrcSet, setImageSrcSet] = useState(
    urlTemplate &&
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
    urlTemplate &&
      setImageSrc(urlTemplate({ size: '640,', rotation: rotation }));
    urlTemplate &&
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
    setImageLoading(true);
  }, [infoUrl, rotation]);

  function routeChangeStart(url: string) {
    if (window.history.state.as !== url) {
      setImageLoading(true);
    }
  }

  const escapeCloseViewer = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) {
      setShowViewer(false);
    }
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);
    document.addEventListener('keydown', escapeCloseViewer);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      document.removeEventListener('keydown', escapeCloseViewer);
    };
  }, []);

  return (
    <>
      {showViewer && (
        <ZoomedImage id={id} infoUrl={infoUrl} setShowViewer={setShowViewer} />
      )}
      <ImageViewerControls>
        <Space v={{ size: 's', properties: ['margin-bottom'] }}>
          <Control
            type="black-on-white"
            text="Zoom in"
            icon="zoomIn"
            clickHandler={() => {
              setShowViewer(true);
            }}
          />
        </Space>
      </ImageViewerControls>

      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {imageLoading && <LL lightn={true} />}
        <ImageWrapper
          imageLoading={imageLoading}
          id={`image-viewer-${id}`}
          aria-hidden="true"
        >
          <IIIFResponsiveImage
            width={width}
            height={height}
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
            lang={lang}
            loadHandler={() => setImageLoading(false)}
            alt={presentationOnly ? '' : alt}
            isLazy={false}
            presentationOnly={presentationOnly}
          />
        </ImageWrapper>
      </div>
    </>
  );
};

export default ImageViewer;
