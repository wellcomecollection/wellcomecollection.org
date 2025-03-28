import openseadragon from 'openseadragon';
import {
  FunctionComponent,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { cross, minus, plus, rotateRight } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import ItemViewerContext from '@weco/content/components/ItemViewerContext/ItemViewerContext';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';

import { queryParamToArrayIndex } from '.';

const ZoomedImageContainer = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.color('black')};
`;

const Controls = styled.div`
  /* TODO position controls at the bottom on small devices, having issues with iPhone so skipping for now */
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;

const Image = styled.div`
  height: 100%;
`;

const ErrorMessage = () => (
  <div>
    <p>The image viewer is not working.</p>
  </div>
);

type ZoomedImageProps = OptionalToUndefined<{
  iiifImageLocation?: DigitalLocation;
}>;

const ZoomedImage: FunctionComponent<ZoomedImageProps> = ({
  iiifImageLocation,
}) => {
  const { transformedManifest, query, setShowZoomed } =
    useContext(ItemViewerContext);
  const currentCanvas =
    transformedManifest?.canvases[queryParamToArrayIndex(query.canvas)];
  const mainImageService = {
    '@id': currentCanvas?.imageServiceId || '',
  };
  const zoomInfoUrl = iiifImageLocation
    ? iiifImageLocation.url
    : convertRequestUriToInfoUri(mainImageService['@id']);
  const [scriptError, setScriptError] = useState(false);
  const [viewer, setViewer] = useState(null);
  const viewerRef: MutableRefObject<{ destroy: () => void } | null> =
    useRef(null);
  const zoomStep = 0.5;
  const firstControl = useRef<HTMLButtonElement>(null);
  const lastControl = useRef<HTMLButtonElement>(null);
  const zoomedImage = useRef<HTMLDivElement>(null);
  const hasInitialised = useRef(false);

  function setupViewer(imageInfoSrc: string, viewerId: string) {
    // We use this to prevent the creation of two `.openseadragon-container`s
    // which would otherwise happen in development with strict mode turned on
    // (which in turn would break tests)
    hasInitialised.current = true;
    fetch(imageInfoSrc)
      .then(response => response.json())
      .then(response => {
        const osdViewer = openseadragon({
          id: `image-viewer-${viewerId}`,
          showNavigationControl: false,
          visibilityRatio: 1,
          tileSources: [
            {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': response['@id'],
              height: response.height,
              width: response.width,
              profile: ['http://iiif.io/api/image/2/level2.json'],
              protocol: 'http://iiif.io/api/image',
              tiles: [
                {
                  scaleFactors: [1, 2, 4, 8, 16, 32],
                  width: 400,
                },
              ],
            },
          ],
        });
        osdViewer.addOnceHandler('tile-loaded', () => {
          doZoomIn(osdViewer);
        });
        osdViewer.addHandler('tile-loaded', () => {
          // Prevent NVDA arrow key events escaping the viewer (https://stackoverflow.com/a/41523306)
          osdViewer.container.setAttribute('role', 'toolbar');
          osdViewer.container.setAttribute(
            'aria-description',
            'use arrow keys to pan the image'
          );
        });
        setViewer(osdViewer);
        viewerRef.current = osdViewer;
      })
      .catch(() => {
        setScriptError(true);
      });
  }

  useEffect(() => {
    !hasInitialised.current && setupViewer(zoomInfoUrl, 'zoomedImage');
    lastControl?.current && lastControl.current.focus();

    return () => viewerRef.current?.destroy();
  }, []);

  function doZoomIn(viewer) {
    if (!viewer) {
      return;
    }
    const max = viewer.viewport.getMaxZoom();
    const nextMax = viewer.viewport.getZoom() + zoomStep;
    const newMax = nextMax <= max ? nextMax : max;

    viewer.viewport.zoomTo(newMax);
  }

  function doZoomOut(viewer) {
    if (!viewer) return;
    const min = viewer.viewport.getMinZoom();
    const nextMin = viewer.viewport.getZoom() - zoomStep;
    const newMin = nextMin >= min ? nextMin : min;

    viewer.viewport.zoomTo(newMin);
  }

  function handleZoomIn(viewer) {
    if (!viewer) return;

    if (viewer.isOpen()) {
      doZoomIn(viewer);
    }
  }

  function handleZoomOut(viewer) {
    if (!viewer) return;
    if (viewer.isOpen()) {
      doZoomOut(viewer);
    }
  }

  function handleRotate(viewer) {
    if (!viewer) return;
    viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
  }

  function handleTrapStartKeyDown(event) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      (
        zoomedImage?.current?.querySelector(
          '.openseadragon-canvas'
        ) as HTMLDivElement
      ).focus();
    }
  }

  function handleTrapEndKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      firstControl?.current?.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.target === firstControl.current) {
      handleTrapStartKeyDown(event);
    }
    if (event.target.classList.contains('openseadragon-canvas')) {
      handleTrapEndKeyDown(event);
    }
  }

  return (
    <ZoomedImageContainer ref={zoomedImage} onKeyDown={handleKeyDown}>
      <Controls>
        <Space
          $v={{
            size: 'l',
            properties: ['margin-top', 'margin-bottom'],
          }}
          $h={{
            size: 'l',
            properties: ['margin-left', 'margin-right'],
          }}
        >
          <Space
            as="span"
            $h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              ref={firstControl}
              colorScheme="black-on-white"
              text="Zoom in"
              icon={plus}
              clickHandler={() => {
                handleZoomIn(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            $h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              colorScheme="black-on-white"
              text="Zoom out"
              icon={minus}
              clickHandler={() => {
                handleZoomOut(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            $h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              colorScheme="black-on-white"
              text="Rotate"
              icon={rotateRight}
              clickHandler={() => {
                handleRotate(viewer);
              }}
            />
          </Space>
          <Space
            as="span"
            $h={{
              size: 'm',
              properties: ['margin-left'],
            }}
          >
            <Control
              ref={lastControl}
              colorScheme="black-on-white"
              text="Close"
              icon={cross}
              clickHandler={() => {
                setShowZoomed(false);
              }}
            />
          </Space>
        </Space>
      </Controls>
      <Image id="image-viewer-zoomedImage">
        {scriptError && <ErrorMessage />}
      </Image>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
