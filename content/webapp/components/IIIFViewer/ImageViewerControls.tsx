import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';

import { rotateRight, zoomIn } from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import ItemViewerContext, {
  RotatedImage,
} from '@weco/content/contexts/ItemViewerContext';

const ImageViewerControlsEl = styled.div<{ $showControls?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 73%;
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
`;

function updateRotatedImages({
  rotatedImages,
  canvasParam,
}: {
  rotatedImages: RotatedImage[];
  canvasParam: number;
}): RotatedImage[] {
  const matchingIndex = rotatedImages.findIndex(
    rotation => rotation.canvas === canvasParam
  );
  if (matchingIndex >= 0) {
    return rotatedImages.map((rotatedImage, i) => {
      if (matchingIndex === i) {
        const currentRotationValue = rotatedImages[matchingIndex].rotation;
        const newRotationValue =
          currentRotationValue < 270 ? currentRotationValue + 90 : 0;
        return {
          canvas: rotatedImage.canvas,
          rotation: newRotationValue,
        };
      } else {
        return rotatedImage;
      }
    });
  } else {
    return [
      ...rotatedImages,
      {
        canvas: canvasParam,
        rotation: 90,
      },
    ];
  }
}

const ImageViewerControls: FunctionComponent = () => {
  const {
    showControls,
    rotatedImages,
    query,
    setRotatedImages,
    setShowZoomed,
  } = useContext(ItemViewerContext);
  const { canvas } = query;

  return (
    <ImageViewerControlsEl $showControls={showControls}>
      <Space
        $h={{ size: 's', properties: ['margin-left'] }}
        $v={{ size: 'l', properties: ['margin-bottom'] }}
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
        $h={{ size: 's', properties: ['margin-left'] }}
        $v={{ size: 'l', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Rotate"
          icon={rotateRight}
          clickHandler={() => {
            setRotatedImages(
              updateRotatedImages({
                rotatedImages,
                canvasParam: canvas,
              })
            );
          }}
        />
      </Space>
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
