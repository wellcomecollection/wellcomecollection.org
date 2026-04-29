import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { chevron, closedFolder, openFolder } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import { UiTreeNode } from '@weco/content/views/pages/works/work/work.types';
import DownloadItem from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.DownloadItem';

import { TreeControl } from './NestedList';

const ItemWrapper = styled.div.attrs({
  className: font('sans', -2),
})`
  display: flex;
  height: ${controlDimensions.controlHeight}px;
  width: 100%;
`;

export type DownloadItemRendererProps = {
  item: UiTreeNode;
  isEnhanced: boolean;
  hasControl: boolean;
  highlightCondition: 'primary' | 'secondary' | undefined;
  workId?: string;
  canvases?: TransformedCanvas[];
  canvasIndexById?: Record<string, number>;
  linkToCanvas?: boolean;
  isDarkMode?: boolean;
  currentCanvasIndex?: number;
  itemOnClick?: () => void;
};

const DownloadItemRenderer: FunctionComponent<DownloadItemRendererProps> = ({
  item,
  isEnhanced,
  hasControl,
  highlightCondition,
  workId,
  canvases,
  canvasIndexById,
  linkToCanvas = false,
  isDarkMode = false,
  currentCanvasIndex = 0,
  itemOnClick,
}) => {
  // Only use canvasIndexById if the structure contains all canvases
  const hasCompleteStructure =
    canvasIndexById &&
    canvases &&
    Object.keys(canvasIndexById).length === canvases.length;

  // findIndex is 0-based and returns -1 if not found
  // Convert to 1-based index for toWorksItemLink, or undefined if not found
  const fallbackIndex = canvases?.findIndex(
    canvas => canvas.id === item.work.id
  );
  const canvasIndex = hasCompleteStructure
    ? canvasIndexById[item.work.id]
    : fallbackIndex !== undefined && fallbackIndex >= 0
      ? fallbackIndex + 1
      : undefined;

  return (
    <ItemWrapper>
      {isEnhanced && hasControl && (
        <TreeControl
          $highlightCondition={highlightCondition}
          $isDarkMode={isDarkMode}
        >
          <Icon
            rotate={item.openStatus ? undefined : 270}
            icon={chevron}
            iconColor={isDarkMode ? 'white' : 'black'}
          />
        </TreeControl>
      )}

      {item.work.type === 'Range' && (
        <span
          style={{
            lineHeight: `${controlDimensions.controlHeight}px`,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ marginRight: '10px' }}>
            <Icon
              icon={item.openStatus ? openFolder : closedFolder}
              matchText={true}
              sizeOverride="height: 14px; width:16px;"
            />
          </span>
          {item.work.title}
        </span>
      )}

      {item.work.type === 'Canvas' &&
        item.work?.downloads?.map(download => {
          const shouldLinkToCanvas =
            linkToCanvas &&
            workId !== undefined &&
            typeof canvasIndex === 'number' &&
            canvasIndex > 0;

          return shouldLinkToCanvas ? (
            <DownloadItem
              key={download.id}
              canvas={item.work as TransformedCanvas}
              item={download}
              workId={workId}
              canvasIndex={canvasIndex}
              linkToCanvas={true}
              currentCanvasIndex={currentCanvasIndex}
              onClick={itemOnClick}
            />
          ) : (
            <DownloadItem
              key={download.id}
              canvas={item.work as TransformedCanvas}
              item={download}
              linkToCanvas={false}
              currentCanvasIndex={currentCanvasIndex}
            />
          );
        })}
    </ItemWrapper>
  );
};

export default DownloadItemRenderer;
