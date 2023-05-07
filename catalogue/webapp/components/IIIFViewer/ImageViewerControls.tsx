import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { useContext, FunctionComponent } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import styled from 'styled-components';
import { rotateRight, zoomIn } from '@weco/common/icons';

const ImageViewerControlsEl = styled.div<{ showControls?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 73%;
  z-index: 1;
  opacity: ${props => (props.showControls ? 1 : 0)};
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

const ImageViewerControls: FunctionComponent = () => {
  const {
    showControls,
    rotatedImages,
    canvasParam,
    urlTemplate,
    setRotatedImages,
    setIsLoading,
    setShowZoomed,
  } = useContext(ItemViewerContext);

  return (
    <ImageViewerControlsEl showControls={showControls || urlTemplate}>
      <Space
        h={{ size: 's', properties: ['margin-left'] }}
        v={{ size: 'l', properties: ['margin-bottom'] }}
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
        h={{ size: 's', properties: ['margin-left'] }}
        v={{ size: 'l', properties: ['margin-bottom'] }}
      >
        <Control
          colorScheme="black-on-white"
          text="Rotate"
          icon={rotateRight}
          clickHandler={() => {
            const matchingIndex = rotatedImages.findIndex(
              rotation => rotation.canvasParam === canvasParam
            );
            if (matchingIndex >= 0) {
              const currentRotationValue =
                rotatedImages[matchingIndex].rotation;
              const newRotationValue =
                currentRotationValue < 270 ? currentRotationValue + 90 : 0;
              rotatedImages[matchingIndex] = {
                canvasParam,
                rotation: newRotationValue,
              };
              setRotatedImages([...rotatedImages]);
            } else {
              setRotatedImages([
                ...rotatedImages,
                {
                  canvasParam,
                  rotation: 90,
                },
              ]);
            }
          }}
        />
      </Space>
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
