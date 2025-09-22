import {
  createElement,
  FunctionComponent,
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
}

// Custom control plugin component that exposes the OpenSeaDragon viewer
const ViewerControlsPlugin = ({
  useViewerState,
  onViewerReady,
}: {
  useViewerState: () => { openSeadragonViewer?: OpenSeaDragonViewer };
  onViewerReady: (viewer: OpenSeaDragonViewer) => void;
}) => {
  const viewerState = useViewerState();

  useEffect(() => {
    if (viewerState?.openSeadragonViewer) {
      onViewerReady(viewerState.openSeadragonViewer);
    }
  }, [viewerState?.openSeadragonViewer, onViewerReady]);

  // Return null as we don't want to render anything in the controls area
  return null;
};

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
  const [CloverViewer, setCloverViewer] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [imageInfo, setImageInfo] = useState<{
    '@context': string;
    '@id': string;
    '@type': string;
    profile: string[];
    protocol: string;
    width: number;
    height: number;
    tiles: {
      width: number;
      height: number;
      scaleFactors: number[];
    }[];
  } | null>(null);
  const [viewer, setViewer] = useState<OpenSeaDragonViewer | null>(null);
  const firstControl = useRef<HTMLButtonElement>(null);
  const lastControl = useRef<HTMLButtonElement>(null);
  const zoomedImage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCloverViewer = async () => {
      try {
        setIsLoading(true);

        const infoResponse = await fetch(zoomInfoUrl);
        const infoData = await infoResponse.json();
        setImageInfo(infoData);

        const dynamicImport = () => {
          return import('@samvera/clover-iiif' as string);
        };

        const cloverModule = await dynamicImport();
        const LoadedCloverViewer =
          cloverModule.CloverViewer || cloverModule.default;

        if (!LoadedCloverViewer) {
          throw new Error('CloverViewer component not found in module');
        }

        setCloverViewer(() => LoadedCloverViewer);
        setIsLoading(false);

        // Focus the first control after loading
        setTimeout(() => {
          firstControl?.current?.focus();
        }, 500);
      } catch (error) {
        console.error('Failed to load clover-iiif:', error);
        setScriptError(true);
        setIsLoading(false);
      }
    };

    loadCloverViewer();
  }, [zoomInfoUrl]);

  const handleViewerReady = (osdViewer: OpenSeaDragonViewer) => {
    setViewer(osdViewer);
  };

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

  // Create a proper IIIF manifest based on the fetched image info
  const manifest =
    CloverViewer && imageInfo
      ? {
          '@context': 'http://iiif.io/api/presentation/3/context.json',
          id: `${imageInfo['@id']}/manifest`,
          type: 'Manifest',
          label: { en: ['Image Viewer'] },
          items: [
            {
              id: `${imageInfo['@id']}/canvas`,
              type: 'Canvas',
              height: imageInfo.height || 3962,
              width: imageInfo.width || 2394,
              items: [
                {
                  id: `${imageInfo['@id']}/annotation-page`,
                  type: 'AnnotationPage',
                  items: [
                    {
                      id: `${imageInfo['@id']}/annotation`,
                      type: 'Annotation',
                      motivation: 'painting',
                      body: {
                        id: `${imageInfo['@id']}/full/max/0/default.jpg`,
                        type: 'Image',
                        format: 'image/jpeg',
                        service: [
                          {
                            '@context': imageInfo['@context'],
                            '@id': imageInfo['@id'],
                            '@type': imageInfo['@type'],
                            profile: imageInfo.profile,
                            protocol: imageInfo.protocol,
                            width: imageInfo.width,
                            height: imageInfo.height,
                            tiles: imageInfo.tiles,
                          },
                        ],
                      },
                      target: `${imageInfo['@id']}/canvas`,
                    },
                  ],
                },
              ],
            },
          ],
        }
      : null;

  // Plugin configuration to access the OpenSeaDragon viewer
  const plugins = CloverViewer
    ? [
        {
          id: 'wellcome-viewer-controls',
          imageViewer: {
            controls: {
              component: ViewerControlsPlugin,
              componentProps: {
                onViewerReady: handleViewerReady,
              },
            },
          },
        },
      ]
    : [];

  if (scriptError) {
    return (
      <ZoomedImageContainer>
        <ErrorMessage />
      </ZoomedImageContainer>
    );
  }

  if (isLoading || !imageInfo) {
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
      <ViewerContainer>
        {CloverViewer &&
          manifest &&
          (() => {
            return createElement(CloverViewer, {
              iiifContent: manifest,
              plugins,
              options: {
                canvasHeight: '100%',
                showNavigationControl: false,
                showTitle: false,
                showInformationToggle: false,
                showIIIFBadge: false,
                showDownload: false,
                informationPanel: {
                  open: false,
                  renderToggle: false,
                  renderAbout: false,
                  renderAnnotation: false,
                  renderSupplementing: false,
                  renderContentSearch: false,
                },
                openSeadragon: {
                  visibilityRatio: 1,
                  minZoomLevel: 0.5,
                  defaultZoomLevel: 1,
                  homeFillsViewer: false,
                  animationTime: 1,
                  showNavigationControl: false,
                  showNavigator: false,
                  showZoomControl: false,
                  showHomeControl: false,
                  showFullPageControl: false,
                  showRotationControl: false,
                  showSequenceControl: false,
                  gestureSettingsMouse: {
                    clickToZoom: false,
                    dblClickToZoom: true,
                  },
                },
              },
            });
          })()}
      </ViewerContainer>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
