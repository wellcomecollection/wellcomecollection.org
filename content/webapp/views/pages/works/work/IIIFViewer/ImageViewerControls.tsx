import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  grayscale,
  invertColours,
  rotateRight,
  zoomIn,
} from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import {
  toggleCanvasInArray,
  updateContrastImages,
  updateRotatedImages,
} from './imageFilterUtils';

const ImageViewerControlsEl = styled.div<{ $showControls?: boolean }>`
  .contrast-slider {
    width: 120px;
    margin-left: 8px;
    vertical-align: middle;
  }
  position: absolute;
  bottom: 5%;
  right: 10%;
  z-index: 1;
  opacity: ${props => (props.$showControls ? 1 : 0)};
  transition: opacity 300ms ease;
  display: flex;

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
`;

const ImageViewerControls: FunctionComponent = () => {
  const {
    showControls,
    rotatedImages,
    query,
    setRotatedImages,
    setShowZoomed,
    grayscaleImages,
    setGrayscaleImages,
    invertedImages,
    setInvertedImages,
    contrastedImages,
    setContrastedImages,
  } = useItemViewerContext();
  const { canvas } = query;
  const currentContrast = Number(
    contrastedImages?.find(c => c.canvas === canvas)?.contrast ?? 100
  );
  return (
    <ImageViewerControlsEl $showControls={showControls}>
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Zoom in"
          icon={zoomIn}
          clickHandler={() => {
            setShowZoomed(true);
          }}
        />
      </Space>
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Rotate"
          icon={rotateRight}
          clickHandler={() => {
            setRotatedImages(updateRotatedImages(rotatedImages, canvas));
          }}
        />
      </Space>
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Invert colours"
          icon={invertColours}
          clickHandler={() => {
            setInvertedImages(toggleCanvasInArray(invertedImages, canvas));
          }}
        />
      </Space>
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Grayscale"
          icon={grayscale}
          clickHandler={() => {
            setGrayscaleImages(toggleCanvasInArray(grayscaleImages, canvas));
          }}
        />
      </Space>
      {/* TODO styling */}
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <label htmlFor="contrast" className="visually-hidden">
          Contrast
        </label>
        <input
          type="range"
          id="contrast"
          className="contrast-slider"
          min={50}
          max={200}
          value={currentContrast}
          onChange={e => {
            const value = Number(e.target.value);
            setContrastedImages(
              updateContrastImages(contrastedImages, canvas, value)
            );
          }}
        />
      </Space>
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
