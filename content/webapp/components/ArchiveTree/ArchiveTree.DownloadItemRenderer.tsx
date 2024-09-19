import { FunctionComponent } from 'react';
import { styled } from 'styled-components';

import { chevron, closedFolder, openFolder } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import { UiTreeNode } from '@weco/content/components/ArchiveTree/ArchiveTree.helpers';
import { TreeControl } from '@weco/content/components/ArchiveTree/ArchiveTree.styles';
import DownloadItem from '@weco/content/components/WorkDetails/WorkDetails.DownloadItem';
import { TransformedCanvas } from '@weco/content/types/manifest';

import { controlDimensions } from './ArchiveTree.helpers';

const ItemWrapper = styled.div.attrs({
  className: font('intr', 6),
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
};

const DownloadItemRenderer: FunctionComponent<DownloadItemRendererProps> = ({
  item,
  isEnhanced,
  hasControl,
  highlightCondition,
}) => {
  return (
    <ItemWrapper>
      {isEnhanced && hasControl && (
        <TreeControl
          data-gtm-trigger="tree_chevron"
          $highlightCondition={highlightCondition}
        >
          <Icon rotate={item.openStatus ? undefined : 270} icon={chevron} />
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
          return (
            <DownloadItem
              key={download.id}
              canvas={item.work as TransformedCanvas}
              item={download}
            />
          );
        })}
    </ItemWrapper>
  );
};

export default DownloadItemRenderer;
