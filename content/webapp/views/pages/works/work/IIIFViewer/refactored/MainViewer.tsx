import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import PaginatedItemViewer from './PaginatedItemViewer';
import VirtualizedImageViewer from './VirtualizedImageViewer';

const MainViewerContainer = styled.div<{ $useFixedList: boolean }>`
  height: 100%;
  ${props =>
    props.$useFixedList
      ? `
    overflow: hidden;
  `
      : `
    position: relative;
  `}
`;

const MainViewer: FunctionComponent = () => {
  const { hasOnlyRenderableImages } = useItemViewerContext();
  return (
    <MainViewerContainer $useFixedList={!hasOnlyRenderableImages}>
      {hasOnlyRenderableImages ? (
        <VirtualizedImageViewer />
      ) : (
        <PaginatedItemViewer />
      )}
    </MainViewerContainer>
  );
};

export default MainViewer;
