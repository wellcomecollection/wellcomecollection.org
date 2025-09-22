import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { cross, minus, plus, rotateRight } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
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
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;

const ViewerContainer = styled.div`
  height: 100%;
  width: 100%;

  .openseadragon-container {
    height: 100% !important;
    width: 100% !important;
  }
`;

const ErrorMessage = () => (
  <div>
    <p>The image viewer is not working.</p>
  </div>
);

const LoadingMessage = () => (
  <div>
    <p>Loading image viewer...</p>
  </div>
);

type ZoomedImageProps = OptionalToUndefined<{
  iiifImageLocation?: DigitalLocation;
}>;

interface OpenSeaDragonViewer {
  viewport: {
    getZoom(): number;
    zoomTo(zoom: number): void;
    getMaxZoom(): number;
    getMinZoom(): number;
    getRotation(): number;
    setRotation(degrees: number): void;
    goHome(): void;
  };
  destroy(): void;
}

const ZoomedImage: FunctionComponent<ZoomedImageProps> = ({
  iiifImageLocation,
}) => {
  const { transformedManifest, query, setShowZoomed } = useItemViewerContext();
  const currentCanvas =
    transformedManifest?.canvases[queryParamToArrayIndex(query.canvas)];
  const mainImageService = {
    '@id': currentCanvas?.imageServiceId || '',
  };
  const zoomInfoUrl = iiifImageLocation
    ? iiifImageLocation.url
    : convertRequestUriToInfoUri(mainImageService['@id']);

  const [scriptError, setScriptError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewer, setViewer] = useState<OpenSeaDragonViewer | null>(null);
  const firstControl = useRef<HTMLButtonElement>(null);
  const lastControl = useRef<HTMLButtonElement>(null);
  const zoomedImage = useRef<HTMLDivElement>(null);
  const viewerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadOpenSeaDragon = async () => {
      try {
        setIsLoading(true);

        // Dynamically import OpenSeaDragon
        const OpenSeadragon = await import('openseadragon');
        const OSD = OpenSeadragon.default || OpenSeadragon;

        // Fetch the IIIF info.json
        const response = await fetch(zoomInfoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch IIIF info: ${response.statusText}`);
        }
        const imageInfo = await response.json();

        // Create the tile source
        const tileSource = {
          '@context': imageInfo['@context'],
          '@id': imageInfo['@id'],
          height: imageInfo.height,
          width: imageInfo.width,
          profile: imageInfo.profile,
          protocol: imageInfo.protocol,
          tiles: imageInfo.tiles,
        };

        // Initialise OpenSeaDragon viewer
        if (viewerContainer.current) {
          const osdViewer = OSD({
            element: viewerContainer.current,
            tileSources: tileSource,
            visibilityRatio: 1.0,
            minZoomLevel: 0.5,
            defaultZoomLevel: 1,
            showNavigationControl: false,
            showZoomControl: false,
            showHomeControl: false,
            showFullPageControl: false,
            showRotationControl: false,
            gestureSettingsMouse: {
              clickToZoom: false,
              dblClickToZoom: true,
            },
            animationTime: 0.3,
          });

          setViewer(osdViewer);
          setIsLoading(false);

          // Focus the first control after loading
          setTimeout(() => {
            firstControl?.current?.focus();
          }, 500);
        }
      } catch (error) {
        console.error('Failed to load OpenSeaDragon:', error);
        setScriptError(true);
        setIsLoading(false);
      }
    };

    loadOpenSeaDragon();

    // Cleanup function
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [zoomInfoUrl]);

  const handleZoomIn = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom();
      const maxZoom = viewer.viewport.getMaxZoom();
      const newZoom = Math.min(currentZoom * 1.5, maxZoom);
      viewer.viewport.zoomTo(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (viewer) {
      const currentZoom = viewer.viewport.getZoom();
      const minZoom = viewer.viewport.getMinZoom();
      const newZoom = Math.max(currentZoom / 1.5, minZoom);
      viewer.viewport.zoomTo(newZoom);
    }
  };

  const handleRotate = () => {
    if (viewer) {
      const currentRotation = viewer.viewport.getRotation();
      viewer.viewport.setRotation(currentRotation + 90);
    }
  };

  const handleReset = () => {
    if (viewer) {
      viewer.viewport.goHome();
    }
  };

  function handleTrapStartKeyDown(event: React.KeyboardEvent) {
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      const canvas = zoomedImage?.current?.querySelector(
        'canvas'
      ) as HTMLCanvasElement;
      if (canvas) {
        canvas.focus();
      }
    }
  }

  function handleTrapEndKeyDown(event: React.KeyboardEvent) {
    if (!event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      firstControl?.current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.target === firstControl.current) {
      handleTrapStartKeyDown(event);
    }
    if ((event.target as HTMLElement)?.tagName === 'CANVAS') {
      handleTrapEndKeyDown(event);
    }

    // Handle escape key to close viewer
    if (event.key === 'Escape') {
      setShowZoomed(false);
    }
  }

  if (scriptError) {
    return (
      <ZoomedImageContainer>
        <ErrorMessage />
      </ZoomedImageContainer>
    );
  }

  if (isLoading) {
    return (
      <ZoomedImageContainer>
        <LoadingMessage />
      </ZoomedImageContainer>
    );
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
              clickHandler={handleZoomIn}
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
              clickHandler={handleZoomOut}
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
              clickHandler={handleRotate}
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
              text="Reset"
              icon={cross}
              clickHandler={handleReset}
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
      <ViewerContainer ref={viewerContainer} />
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
