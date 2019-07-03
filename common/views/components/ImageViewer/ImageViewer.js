// @flow
import { useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import { spacing, classNames } from '../../../utils/classnames';
import Raven from 'raven-js';
import { trackEvent } from '../../../utils/ga';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import Control from '../Buttons/Control/Control';
import LL from '../styled/LL';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

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
  top: ${props => (props.isGroupedWithPagination ? '100px' : 0)};
  left: 12px;
  z-index: 1;
}`;

const ImageWrapper = styled.div`
  cursor: zoom-in;
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

function getTileSources(data) {
  return [
    {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': data['@id'],
      height: data.height,
      width: data.width,
      profile: ['http://iiif.io/api/image/2/level2.json'],
      protocol: 'http://iiif.io/api/image',
      tiles: [
        {
          scaleFactors: [1, 2, 4, 8, 16, 32],
          width: 400,
        },
      ],
    },
  ];
}
type ImageViewerProps = {|
  id: string,
  src: string,
  srcSet: string,
  width: number,
  height?: number,
  infoUrl: string,
  lang: ?string,
  tabbableControls: boolean,
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
}: ImageViewerProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [isLoadingViewer, setIsLoadingViewer] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [isError, setIsError] = useState(false);
  const zoomStep = 0.5;

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

  useEffect(() => {
    if (viewer) {
      fetch(infoUrl)
        .then(response => response.json())
        .then(data => {
          viewer.open(getTileSources(data));
        });
      viewer.open(setImageLoading(false));
    }
  }, [infoUrl]);

  async function setupViewer(imageInfoSrc, viewerId) {
    setIsLoadingViewer(true);

    if (viewer) {
      setIsLoadingViewer(false);

      return viewer;
    }

    const { default: OpenSeadragon } = await import('openseadragon');

    return fetch(imageInfoSrc)
      .then(response => response.json())
      .then(data => {
        const osdViewer = OpenSeadragon({
          id: `image-viewer-${viewerId}`,
          showNavigationControl: false,
          visibilityRatio: 1,
          gestureSettingsMouse: {
            scrollToZoom: false,
          },
          tileSources: getTileSources(data),
        });
        setIsError(false);
        setViewer(osdViewer);
        setIsLoadingViewer(false);

        return osdViewer;
      })
      .catch(error => {
        Raven.captureException(new Error(`OpenSeadragon error: ${error}`), {
          tags: {
            service: 'dlcs',
          },
        });
        setIsError(true);
      });
  }

  async function handleRotate() {
    if (isLoadingViewer) return;

    const v = await setupViewer(infoUrl, id);

    v.viewport.setRotation(v.viewport.getRotation() + 90);

    trackEvent({
      category: 'Control',
      action: 'rotate ImageViewer',
      label: id,
    });
  }

  function doZoomIn(viewer) {
    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + zoomStep;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  function doZoomOut(viewer) {
    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - zoomStep;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  async function handleZoomIn() {
    if (isLoadingViewer) return;

    const v = await setupViewer(infoUrl, id);

    if (v.isOpen()) {
      doZoomIn(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomIn(v);
      });
    }

    trackEvent({
      category: 'Control',
      action: 'zoom in ImageViewer',
      label: id,
    });
  }

  async function handleZoomOut() {
    if (isLoadingViewer) return;

    const v = await setupViewer(infoUrl, id);

    if (v.isOpen()) {
      doZoomOut(v);
    } else {
      v.addOnceHandler('tile-loaded', _ => {
        doZoomOut(v);
      });
    }

    trackEvent({
      category: 'Control',
      action: 'zoom out ImageViewer',
      label: id,
    });
  }

  return (
    <>
      <TogglesContext.Consumer>
        {({ groupImageControlsWithPagination }) => (
          <ImageViewerControls
            isGroupedWithPagination={groupImageControlsWithPagination}
          >
            <Control
              tabIndex={tabbableControls ? '0' : '-1'}
              type="on-black"
              text="Zoom in"
              icon="zoomIn"
              clickHandler={handleZoomIn}
            />
            <Control
              tabIndex={tabbableControls ? '0' : '-1'}
              type="on-black"
              text="Zoom out"
              icon="zoomOut"
              clickHandler={handleZoomOut}
            />
            <Control
              tabIndex={tabbableControls ? '0' : '-1'}
              type="on-black"
              text="Rotate"
              icon="rotatePageRight"
              clickHandler={handleRotate}
            />
          </ImageViewerControls>
        )}
      </TogglesContext.Consumer>

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
          {isError && (
            <p
              className={classNames({
                [spacing({ s: 10 }, { padding: ['right', 'left'] })]: true,
              })}
            >
              The image viewer is not working
            </p>
          )}
          {!viewer && (
            // TODO: maybe add role="presentation" to img?
            <IIIFResponsiveImage
              width={width}
              height={height}
              src={src}
              srcSet={srcSet}
              sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
              extraClasses={classNames({
                'block h-center': true,
                [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
              })}
              lang={lang}
              clickHandler={handleZoomIn}
              loadHandler={() => setImageLoading(false)}
              alt=""
              isLazy={false}
            />
          )}
        </ImageWrapper>
      </div>
    </>
  );
};

export default ImageViewer;
