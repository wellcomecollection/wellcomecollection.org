// @flow
import { useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '../styled/LL';
import { imageSizes } from '../../../utils/image-sizes';
import Control from '../Buttons/Control/Control';

const ImageViewerControls = styled.div`
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

  position: absolute;
  top: 100px;
  left: 12px;
  z-index: 1;
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
  src: string,
  srcSet: string,
  width: number,
  height?: number,
  infoUrl: string,
  lang: ?string,
  tabbableControls: boolean,
  urlTemplate?: any, // TODO shouldn't be optional
|};

const ImageViewer = ({
  id,
  width,
  height,
  lang,
  infoUrl,
  src,
  srcSet,
  tabbableControls,
  urlTemplate,
}: ImageViewerProps) => {
  const [imageLoading, setImageLoading] = useState(false); // Used to display loading pattern between page loads
  const [imageSrc, setImageSrc] = useState(src); // TODO use urlTemplate
  const [imageSrcSet, setImageSrcSet] = useState(srcSet); // TODO use urlTemplate
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    urlTemplate &&
      setImageSrc(urlTemplate({ size: '640,', rotation: rotation })); // TODO remove conditional once not optional
    urlTemplate && // TODO remove conditional once not optional
      setImageSrcSet(
        imageSizes(2048)
          .map(width => {
            return `${urlTemplate({
              size: `${width},`,
              rotation: rotation,
            })} ${width}w`;
          })
          .join(',')
      );
  }, [rotation]);

  function routeChangeStart(url: string) {
    if (window.history.state.as !== url) {
      setImageLoading(true);
    }
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, []);

  return (
    <>
      <ImageViewerControls>
        <Control
          tabIndex={tabbableControls ? '0' : '-1'}
          type="on-black"
          text="Zoom in"
          icon="zoomIn"
          clickHandler={() => {
            window.alert('zoom the image please');
          }}
        />

        <Control
          tabIndex={tabbableControls ? '0' : '-1'}
          type="on-black"
          text="Rotate"
          icon="rotatePageRight"
          clickHandler={() => {
            setRotation(rotation < 270 ? rotation + 90 : 0);
          }}
        />
      </ImageViewerControls>

      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {imageLoading && <LL />}
        <ImageWrapper
          imageLoading={imageLoading}
          id={`image-viewer-${id}`}
          aria-hidden="true"
        >
          {/* // TODO: maybe add role="presentation" to img? */}
          <IIIFResponsiveImage
            width={width}
            height={height}
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
            lang={lang}
            // clickHandler={handleZoomIn}
            loadHandler={() => setImageLoading(false)}
            alt=""
            isLazy={false}
          />
        </ImageWrapper>
      </div>
    </>
  );
};

export default ImageViewer;
