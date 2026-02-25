import { FunctionComponent } from 'react';

import { RelatedWork } from '@weco/content/services/wellcome/catalogue/types';
import { DownloadItemRendererProps } from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  CanvasWork,
  RangeWork,
  UiTree,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import { WorkItemRendererProps } from './ArchiveTree.WorkItemRenderer';

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
  fullTree: UiTree;
  setArchiveTree: (tree: UiTree) => void;
  level: number;
  tabbableId?: string;
  setTabbableId: (id: string) => void;
  archiveAncestorArray: RelatedWork[];
  firstItemTabbable: boolean;
  showFirstLevelGuideline: boolean;
  ItemRenderer: FunctionComponent<
    DownloadItemRendererProps | WorkItemRendererProps
  >;
  flatMode?: boolean;
};

export const isRelatedWork = (
  work: RelatedWork | CanvasWork | RangeWork
): work is RelatedWork => {
  return work.type !== 'Range' && work.type !== 'Canvas';
};

export function getTabbableIds(tree: UiTree): string[] {
  return tree.reduce((acc: string[], curr) => {
    acc.push(curr.work.id);
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
    if (item.work.id === id) {
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
  return isRelatedWork(item.work)
    ? `${item.work.title}${
        item.work.referenceNumber
          ? `, reference number ${item.work.referenceNumber}`
          : ''
      }`
    : item.work.title;
}
