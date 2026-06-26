import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { rotateRight, zoomIn } from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { CanvasRotatedImage } from '@weco/content/types/item-viewer';
import { isChoiceBody } from '@weco/content/utils/iiif/v3';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/IIIFViewer';

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

const QualityButton = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  padding: 0;
  transition: background ${props => props.theme.transitionProperties};
  border: 2px solid ${props => props.theme.color('neutral.700')};
  background: ${props =>
    props.$isSelected
      ? props.theme.color('yellow')
      : props.theme.color('white')};
  color: ${props => props.theme.color('neutral.700')};
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  text-align: center;

  &:hover {
    background: ${props => props.theme.color('yellow')};
  }
`;

function updateRotatedImages({
  rotatedImages,
  canvasParam,
}: {
  rotatedImages: CanvasRotatedImage[];
  canvasParam: number;
}): CanvasRotatedImage[] {
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
    transformedManifest,
    selectedChoiceIndex,
    setSelectedChoiceIndex,
  } = useItemViewerContext();
  const { canvas } = query;

  // Check if current canvas has Choice items
  const currentCanvas =
    transformedManifest?.canvases?.[queryParamToArrayIndex(canvas)];
  const choiceItem = currentCanvas?.painting.find(p => isChoiceBody(p));
  const choiceItems =
    choiceItem && 'items' in choiceItem ? choiceItem.items : [];
  const hasChoice = choiceItems.length > 1;

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
            setRotatedImages(
              updateRotatedImages({
                rotatedImages,
                canvasParam: canvas,
              })
            );
          }}
        />
      </Space>
      {hasChoice &&
        choiceItems.map((_, index) => (
          <Space
            key={index}
            $h={{ size: 'xs', properties: ['margin-left'] }}
            $v={{ size: 'md', properties: ['margin-bottom'] }}
          >
            <QualityButton
              $isSelected={selectedChoiceIndex === index}
              onClick={() => setSelectedChoiceIndex(index)}
              aria-label={`Quality ${index + 1}`}
              title={`Quality ${index + 1}`}
            >
              {index + 1}
            </QualityButton>
          </Space>
        ))}
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
