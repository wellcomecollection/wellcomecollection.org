import { RefObject } from 'react';
import { RelatedWork } from '@weco/content/services/wellcome/catalogue/types';

export const instructions =
  'Archive Tree: Tab into the tree, then use up and down arrows to move through tree items. Use right and left arrows to toggle sub menus open and closed. When focused on an item you can tab to the link it contains.';

export const controlDimensions = {
  controlWidth: 44,
  controlHeight: 44,
  circleWidth: 30,
  circleHeight: 30,
  circleBorder: 2,
};

export const verticalGuidePosition =
  controlDimensions.controlHeight / 2 +
  controlDimensions.circleHeight / 2 -
  controlDimensions.circleBorder;

export type TreeItemProps = {
  $isEnhanced?: boolean;
  $showGuideline?: boolean;
};

export type ListProps = {
  currentWorkId: string;
  fullTree: UiTree;
  setArchiveTree: (tree: UiTree) => void;
  level: number;
  tabbableId?: string;
  setTabbableId: (id: string) => void;
  archiveAncestorArray: RelatedWork[];
};

export type UiTreeNode = {
  openStatus: boolean;
  work: RelatedWork;
  parentId?: string;
  children?: UiTree;
};

export type UiTree = UiTreeNode[];

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
  value: UiTreeNode[];
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
