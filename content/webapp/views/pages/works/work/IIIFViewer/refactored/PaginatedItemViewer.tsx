import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';

import IIIFItem from './IIIFItem';
import { useCurrentCanvas } from './MainViewer.helpers';

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
  const { transformedManifest, query, setShowFullscreenControl } =
    useItemViewerContext();
  const { canvases, auth, placeholderId } = {
    ...transformedManifest,
  };
  const externalAccessService = auth?.externalAccessService;
  const currentCanvas = useCurrentCanvas();

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
        titleOverride={`${query.canvas}/${canvases?.length}`}
        exclude={[]}
        externalAccessService={externalAccessService}
        isDark
        showVideoTranscript={false}
      />
    </ItemWrapper>
  ));
};

export default PaginatedItemViewer;
