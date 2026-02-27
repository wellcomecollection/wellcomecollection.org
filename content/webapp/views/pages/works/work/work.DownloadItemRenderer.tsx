import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { chevron, closedFolder, openFolder } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import { UiTreeNode } from '@weco/content/views/pages/works/work/work.types';
import DownloadItem from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.DownloadItem';

import { TreeControl } from './ArchiveTree/ArchiveTree.styles';

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
  canvasIndexById?: Record<string, number>;
  linkToCanvas?: boolean;
  flatMode?: boolean;
  darkMode?: boolean;
  currentCanvasIndex?: number;
};

const DownloadItemRenderer: FunctionComponent<DownloadItemRendererProps> = ({
  item,
  isEnhanced,
  hasControl,
  highlightCondition,
  workId,
  canvasIndexById,
  linkToCanvas = false,
  flatMode = false,
  darkMode = false,
  currentCanvasIndex = 0,
}) => {
  const canvasIndex = canvasIndexById?.[item.work.id];
  return (
    <ItemWrapper>
      {isEnhanced && hasControl && (
        <TreeControl
          data-gtm-trigger="tree_chevron"
          $highlightCondition={highlightCondition}
          $flatMode={flatMode}
          $darkMode={darkMode}
        >
          {!flatMode && (
            <Icon
              rotate={item.openStatus ? undefined : 270}
              icon={chevron}
              iconColor={darkMode ? 'white' : 'black'}
            />
          )}
        </TreeControl>
      )}

      {item.work.type === 'Range' && (
        <span style={{ lineHeight: `${controlDimensions.controlHeight}px` }}>
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
            linkToCanvas && workId !== undefined && canvasIndex !== undefined;

          return shouldLinkToCanvas ? (
            <DownloadItem
              key={download.id}
              canvas={item.work as TransformedCanvas}
              item={download}
              workId={workId}
              canvasIndex={canvasIndex}
              linkToCanvas={true}
              currentCanvasIndex={currentCanvasIndex}
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
