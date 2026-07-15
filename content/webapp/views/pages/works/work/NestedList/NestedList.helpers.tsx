import { FunctionComponent } from 'react';

import { WorkItemRendererProps } from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.WorkItemRenderer';
import { DownloadItemRendererProps } from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  TreeDataCanvas,
  TreeDataRange,
  TreeDataWork,
  UiTree,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

export const verticalGuidePosition =
  controlDimensions.controlHeight / 2 +
  controlDimensions.circleHeight / 2 -
  controlDimensions.circleBorder;

export type TreeItemProps = {
  $isEnhanced?: boolean;
  $showGuideline?: boolean;
};

export type ListProps = {
  item: UiTreeNode;
  currentWorkId: string;
  tree: UiTree;
  setTree: (tree: UiTree) => void;
  level: number;
  tabbableId?: string;
  setTabbableId: (id: string) => void;
  workAncestors?: TreeDataWork[];
  firstItemTabbable: boolean;
  showFirstLevelGuideline: boolean;
  ItemRenderer: FunctionComponent<
    DownloadItemRendererProps | WorkItemRendererProps
  >;
};

export const isTreeDataWork = (
  data: TreeDataWork | TreeDataCanvas | TreeDataRange
): data is TreeDataWork => {
  return data.type !== 'Range' && data.type !== 'Canvas';
};

export function getTabbableIds(tree: UiTree): string[] {
  return tree.reduce((acc: string[], curr) => {
    acc.push(curr.data.id);
    if (curr.openStatus && curr.children) {
      acc = acc.concat(getTabbableIds(curr.children));
    }
    return acc;
  }, []);
}

export function updateChildren({
  tree,
  id,
  value,
  manualUpdate = false,
}: {
  tree: UiTree;
  id: string;
  value: UiTree;
  manualUpdate?: boolean;
}): UiTree {
  return tree.map(item => {
    if (item.data.id === id) {
      return {
        ...item,
        openStatus: manualUpdate || item.openStatus,
        children: value,
      };
    } else {
      return {
        ...item,
        children: item.children
          ? updateChildren({
              tree: item.children,
              id,
              value,
              manualUpdate,
            })
          : undefined,
      };
    }
  });
}

export function getAriaLabel(item: UiTreeNode) {
  return isTreeDataWork(item.data)
    ? `${item.data.title}${
        item.data.referenceNumber
          ? `, reference number ${item.data.referenceNumber}`
          : ''
      }`
    : item.data.title;
}
