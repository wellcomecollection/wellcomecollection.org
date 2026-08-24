import { FunctionComponent } from 'react';

import { WorkItemRendererProps } from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.WorkItemRenderer';
import { DownloadItemRendererProps } from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { getControlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  TreeDataCanvas,
  TreeDataRange,
  TreeDataWork,
  UiTree,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

// Centres the guideline's dot/line on the control, whichever size applies,
// so a denser layout (e.g. the archive collection contents table) keeps the
// guideline centred on its own, smaller chevron.
export function getVerticalGuidePosition(isCompact?: boolean): number {
  const { controlHeight, circleHeight, circleBorder } =
    getControlDimensions(isCompact);
  return controlHeight / 2 + circleHeight / 2 - circleBorder;
}

export type TreeItemProps = {
  $isEnhanced?: boolean;
  $showGuideline?: boolean;
  $isCompact?: boolean;
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
  ItemRenderer:
    | FunctionComponent<DownloadItemRendererProps>
    | FunctionComponent<WorkItemRendererProps>;
  isCompact?: boolean;
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

// The API's `type` field for an archive work is either the generic 'Work'
// (the leaf/item level) or a specific archive level (Collection/Series/
// Section); this maps it to the label shown/announced for a tree row.
export function getWorkLevelLabel(type: TreeDataWork['type']): string {
  return type === 'Work' ? 'Item' : type;
}

export function getAriaLabel(item: UiTreeNode) {
  if (!isTreeDataWork(item.data)) return item.data.title;

  const { title, referenceNumber, type } = item.data;
  return `${title}${
    referenceNumber ? `, reference number ${referenceNumber}` : ''
  }, ${getWorkLevelLabel(type)}`;
}
