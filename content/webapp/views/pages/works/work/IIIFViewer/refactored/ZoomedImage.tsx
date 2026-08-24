import openseadragon from 'openseadragon';
import {
  FunctionComponent,
  KeyboardEvent,
  MutableRefObject,
  PropsWithChildren,
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
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';

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

const OpenSeadragonContainer = styled.div`
  height: 100%;
`;

const ErrorMessage = () => (
  <div>
    <p>The image viewer is not working.</p>
  </div>
);

const ZOOM_STEP = 0.5;

const ControlSpacer: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Space as="span" $h={{ size: 'sm', properties: ['margin-left'] }}>
    {children}
  </Space>
);

type ZoomedImageProps = OptionalToUndefined<{
  iiifImageLocation?: DigitalLocation;
}>;

const ZoomedImage: FunctionComponent<ZoomedImageProps> = ({
  iiifImageLocation,
}) => {
  const { mainImageService, setShowZoomed } = useItemViewerContext();
  const zoomInfoUrl = iiifImageLocation
    ? iiifImageLocation.url
    : convertRequestUriToInfoUri(mainImageService['@id'] || '');
  const [scriptError, setScriptError] = useState(false);
  // osdViewerInstance re-renders the click handlers below with the current
  // viewer; viewerRef tracks the same instance without triggering a
  // re-render, so it can be read from the unmount cleanup effect
  const [osdViewerInstance, setOsdViewerInstance] =
    useState<openseadragon.Viewer | null>(null);

  const viewerRef: MutableRefObject<openseadragon.Viewer | null> = useRef(null);
  const firstControl = useRef<HTMLButtonElement>(null);
  const lastControl = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
            // OpenSeadragon supports IIIF tile sources at runtime, but its
            // types don't include them
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
            } as unknown as openseadragon.TileSource,
          ],
        });
        osdViewer.addOnceHandler('tile-loaded', () => {
          zoomBy(osdViewer, ZOOM_STEP);
        });
        osdViewer.addHandler('tile-loaded', () => {
          // Prevent NVDA arrow key events escaping the viewer (https://stackoverflow.com/a/41523306)
          osdViewer.container.setAttribute('role', 'toolbar');
          osdViewer.container.setAttribute(
            'aria-description',
            'use arrow keys to pan the image'
          );
        });
        setOsdViewerInstance(osdViewer);
        viewerRef.current = osdViewer;
      })
      .catch(() => {
        setScriptError(true);
      });
  }

  useEffect(() => {
    if (!hasInitialised.current && zoomInfoUrl) {
      setupViewer(zoomInfoUrl, 'zoomedImage');
    }
    if (lastControl.current) {
      lastControl.current.focus();
    }

    return () => viewerRef.current?.destroy();
  }, []);

  // Positive delta zooms in (clamped to the max zoom), negative zooms out
  // (clamped to the min zoom).
  function zoomBy(viewer: openseadragon.Viewer | null, delta: number) {
    if (!viewer) return;
    const currentZoom = viewer.viewport.getZoom();
    const clampedZoom =
      delta > 0
        ? Math.min(currentZoom + delta, viewer.viewport.getMaxZoom())
        : Math.max(currentZoom + delta, viewer.viewport.getMinZoom());

    viewer.viewport.zoomTo(clampedZoom);
  }

  function handleZoom(viewer: openseadragon.Viewer | null, delta: number) {
    if (!viewer) return;
    if (viewer.isOpen()) {
      zoomBy(viewer, delta);
    }
  }

  function handleRotate(viewer: openseadragon.Viewer | null) {
    if (!viewer) return;
    viewer.viewport.setRotation(viewer.viewport.getRotation() + 90);
  }

  function handleTrapStartKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      (
        containerRef.current?.querySelector(
          '.openseadragon-canvas'
        ) as HTMLDivElement
      ).focus();
    }
  }

  function handleTrapEndKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      firstControl?.current?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target === firstControl.current) {
      handleTrapStartKeyDown(event);
    }
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains('openseadragon-canvas')
    ) {
      handleTrapEndKeyDown(event);
    }
  }

  return (
    <ZoomedImageContainer ref={containerRef} onKeyDown={handleKeyDown}>
      <Controls>
        <Space
          $v={{
            size: 'md',
            properties: ['margin-top', 'margin-bottom'],
          }}
          $h={{
            size: 'md',
            properties: ['margin-left', 'margin-right'],
          }}
        >
          <ControlSpacer>
            <Control
              ref={firstControl}
              colorScheme="black-on-white"
              text="Zoom in"
              icon={plus}
              clickHandler={() => {
                handleZoom(osdViewerInstance, ZOOM_STEP);
              }}
            />
          </ControlSpacer>
          <ControlSpacer>
            <Control
              colorScheme="black-on-white"
              text="Zoom out"
              icon={minus}
              clickHandler={() => {
                handleZoom(osdViewerInstance, -ZOOM_STEP);
              }}
            />
          </ControlSpacer>
          <ControlSpacer>
            <Control
              colorScheme="black-on-white"
              text="Rotate"
              icon={rotateRight}
              clickHandler={() => {
                handleRotate(osdViewerInstance);
              }}
            />
          </ControlSpacer>
          <ControlSpacer>
            <Control
              ref={lastControl}
              colorScheme="black-on-white"
              text="Close"
              icon={cross}
              clickHandler={() => {
                setShowZoomed(false);
              }}
            />
          </ControlSpacer>
        </Space>
      </Controls>
      <OpenSeadragonContainer
        id="image-viewer-zoomedImage"
        data-testid="zoomed-image"
      >
        {scriptError && <ErrorMessage />}
      </OpenSeadragonContainer>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
