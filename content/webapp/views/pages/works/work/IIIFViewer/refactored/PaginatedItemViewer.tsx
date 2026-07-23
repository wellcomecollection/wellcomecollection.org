import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { getDisplayItems } from '@weco/content/utils/iiif/v3/canvas';

import IIIFItem from './IIIFItem';
import { useCurrentCanvas } from './MainViewer.helpers';

const ItemWrapper = styled.div<{ $firstItemIsRestricted?: boolean }>`
  height: 100%;
  ${props => (props.$firstItemIsRestricted ? 'margin-top: 2em;' : null)}

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
  const { canvas } = query;
  const { canvases, auth, placeholderId } = {
    ...transformedManifest,
  };
  const externalAccessService = auth?.externalAccessService;
  const currentCanvas = useCurrentCanvas();

  useEffect(() => {
    setShowFullscreenControl(false);
  }, [setShowFullscreenControl]);

  const displayItems = currentCanvas ? getDisplayItems(currentCanvas) : [];

  return (
    <>
      {displayItems.map((item, i) => {
        return (
          currentCanvas && (
            <ItemWrapper key={item.type + item.id}>
              <IIIFItem
                placeholderId={placeholderId}
                item={item}
                i={i}
                canvas={currentCanvas}
                titleOverride={`${canvas}/${canvases?.length}`}
                exclude={[]}
                isDark={true}
                externalAccessService={externalAccessService}
                showVideoTranscript={false}
              />
            </ItemWrapper>
          )
        );
      })}
    </>
  );
};

export default PaginatedItemViewer;
