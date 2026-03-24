import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import {
  contrast,
  grayscale,
  invertColours,
  refresh,
  rotateRight,
} from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import {
  toggleCanvasInArray,
  updateContrastImages,
  updateRotatedImages,
} from '@weco/content/views/pages/works/work/IIIFViewer/imageFilterUtils';

const ContrastSlider = styled.div`
  display: inline-flex;
  align-items: center;
  height: 46px;
  background: ${props => props.theme.color('white')};
  border-radius: 23px;
  padding-right: 10px;

  label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    cursor: pointer;

    .icon__shape {
      fill: ${props => props.theme.color('neutral.700')};
    }
  }

  input[type='range'] {
    width: 80px;
    margin: 0;
    cursor: pointer;
    accent-color: ${props => props.theme.color('yellow')};
  }
`;

type Props = {
  canvas: number;
  zoomControls: ReactNode;
  closeButton?: ReactNode;
  onExtraReset?: () => void;
  contrastInputId?: string;
};

const SharedImageViewerControls: FunctionComponent<Props> = ({
  canvas,
  zoomControls,
  closeButton,
  onExtraReset,
  contrastInputId = 'contrast',
}) => {
  const {
    rotatedImages,
    setRotatedImages,
    grayscaleImages,
    setGrayscaleImages,
    invertedImages,
    setInvertedImages,
    contrastedImages,
    setContrastedImages,
  } = useItemViewerContext();

  const currentContrast =
    contrastedImages?.find(c => c.canvas === canvas)?.contrast ?? 100;

  return (
    <>
      {zoomControls}
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
        <Control
          colorScheme="black-on-white"
          text="Rotate"
          icon={rotateRight}
          clickHandler={() => {
            setRotatedImages(updateRotatedImages(rotatedImages, canvas));
          }}
        />
      </Space>
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
        <Control
          colorScheme="black-on-white"
          text="Invert colours"
          icon={invertColours}
          clickHandler={() => {
            setInvertedImages(toggleCanvasInArray(invertedImages, canvas));
          }}
        />
      </Space>
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
        <Control
          colorScheme="black-on-white"
          text="Grayscale"
          icon={grayscale}
          clickHandler={() => {
            setGrayscaleImages(toggleCanvasInArray(grayscaleImages, canvas));
          }}
        />
      </Space>
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
        <ContrastSlider>
          <label htmlFor={contrastInputId}>
            <Icon icon={contrast} />
            <span className="visually-hidden">Contrast</span>
          </label>
          <input
            type="range"
            id={contrastInputId}
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
      <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
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
            onExtraReset?.();
          }}
        />
      </Space>
      {closeButton}
    </>
  );
};

export default SharedImageViewerControls;
