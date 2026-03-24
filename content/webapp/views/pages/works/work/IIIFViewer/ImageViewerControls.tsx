import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  contrast,
  grayscale,
  invertColours,
  refresh,
  rotateRight,
  zoomIn,
} from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import {
  toggleCanvasInArray,
  updateContrastImages,
  updateRotatedImages,
} from './imageFilterUtils';
import { ContrastSlider } from './ImageViewerControls.styles';

const ImageViewerControlsEl = styled.div<{ $showControls?: boolean }>`
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
  const currentContrast =
    contrastedImages?.find(c => c.canvas === canvas)?.contrast ?? 100;
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
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <ContrastSlider>
          <label htmlFor="contrast">
            <Icon icon={contrast} />
            <span className="visually-hidden">Contrast</span>
          </label>
          <input
            type="range"
            id="contrast"
            min={50}
            max={200}
            value={currentContrast}
            onChange={e => {
              setContrastedImages(
                updateContrastImages(
                  contrastedImages,
                  canvas,
                  Number(e.target.value)
                )
              );
            }}
          />
        </ContrastSlider>
      </Space>
      <Space
        $h={{ size: 'xs', properties: ['margin-left'] }}
        $v={{ size: 'md', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Reset"
          icon={refresh}
          clickHandler={() => {
            setInvertedImages(invertedImages.filter(c => c !== canvas));
            setGrayscaleImages(grayscaleImages.filter(c => c !== canvas));
            setContrastedImages(
              contrastedImages.filter(c => c.canvas !== canvas)
            );
            setRotatedImages(rotatedImages.filter(r => r.canvas !== canvas));
          }}
        />
      </Space>
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
