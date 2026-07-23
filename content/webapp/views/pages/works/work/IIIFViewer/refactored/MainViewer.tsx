import { FunctionComponent } from 'react';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import PaginatedItemViewer from './PaginatedItemViewer';
import VirtualizedImageViewer from './VirtualizedImageViewer';

const MainViewer: FunctionComponent = () => {
  const { hasOnlyRenderableImages } = useItemViewerContext();
  return hasOnlyRenderableImages ? (
    <VirtualizedImageViewer />
  ) : (
    <PaginatedItemViewer />
  );
};

export default MainViewer;
