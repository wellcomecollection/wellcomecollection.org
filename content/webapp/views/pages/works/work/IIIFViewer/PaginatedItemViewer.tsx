import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext/refactored';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';

import { useCanvasPositionLabel } from './CanvasPositionIndicator';
import IIIFItem from './IIIFItem';

const ItemWrapper = styled.div`
  height: 100%;

  .pdf-wrapper,
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  video {
    display: block;
    max-height: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
`;

const PaginatedItemViewer: FunctionComponent = () => {
  const { transformedManifest, setShowFullscreenControl, currentCanvas } =
    useItemViewerContext();
  const { auth, placeholderId } = {
    ...transformedManifest,
  };
  const externalAccessService = auth?.externalAccessService;
  const canvasPositionLabel = useCanvasPositionLabel();

  useEffect(() => {
    setShowFullscreenControl(false);
  }, [setShowFullscreenControl]);

  if (!currentCanvas) return null;

  const displayItems = getDisplayItems(currentCanvas);

  return displayItems.map((item, i) => (
    <ItemWrapper key={item.type + item.id} data-component="paginated">
      <IIIFItem
        placeholderId={placeholderId}
        item={item}
        i={i}
        canvas={currentCanvas}
        titleOverride={canvasPositionLabel}
        exclude={[]}
        externalAccessService={externalAccessService}
        showVideoTranscript={false}
        isDark
      />
    </ItemWrapper>
  ));
};

export default PaginatedItemViewer;
