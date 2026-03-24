import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { zoomIn } from '@weco/common/icons';
import Control from '@weco/common/views/components/Control';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import SharedImageViewerControls from '@weco/content/views/pages/works/work/IIIFViewer/SharedImageViewerControls';

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
  const { showControls, query, setShowZoomed } = useItemViewerContext();
  const { canvas } = query;

  return (
    <ImageViewerControlsEl $showControls={showControls}>
      <SharedImageViewerControls
        canvas={canvas}
        zoomControls={
          <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
            <Control
              colorScheme="black-on-white"
              text="Zoom in"
              icon={zoomIn}
              clickHandler={() => {
                setShowZoomed(true);
              }}
            />
          </Space>
        }
      />
    </ImageViewerControlsEl>
  );
};

export default ImageViewerControls;
