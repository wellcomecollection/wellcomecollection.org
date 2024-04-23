import { RelatedWork } from '@weco/content/services/wellcome/catalogue/types';
import { ReactElement } from 'react';
import {
  getLabelString,
  isTransformedCanvas,
  getOriginalFiles,
  isCanvas,
  isRange,
} from '@weco/content/utils/iiif/v3';
import {
  Manifest,
  ChoiceBody,
  ContentResource,
  Range,
} from '@iiif/presentation-3';
import {
  TransformedCanvas,
  CustomContentResource,
} from '@weco/content/types/manifest';
import { isString } from '@weco/common/utils/type-guards';

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
  firstItemTabbable: boolean;
  showFirstLevelGuideline: boolean;
  ItemRenderer: ReactElement<{
    item: UiTreeNode;
    isEnhanced: boolean;
    level: number;
    showFirstLevelGuideline: boolean;
    hasControl: boolean;
    highlightCondition: 'primary' | 'secondary' | undefined;
  }>;
};

type CanvasWork = TransformedCanvas & {
  title: string;
  totalParts: number;
  downloads: (ContentResource | CustomContentResource | ChoiceBody)[];
};

type RangeWork = Range & {
  title: string;
  totalParts: number;
};

export const isRelatedWork = (
  work: RelatedWork | CanvasWork | RangeWork
): work is RelatedWork => {
  return work.type !== 'Range' && work.type !== 'Canvas';
};

export type UiTreeNode = {
  openStatus: boolean;
  parentId?: string;
  children?: UiTree;
  work: RelatedWork | CanvasWork | RangeWork;
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

export function convertStructuresToTree(
  structures: Manifest['structures'],
  canvases: TransformedCanvas[] | undefined,
  parentId: string
): UiTree {
  const items = structures && structures.length > 0 ? structures : canvases;
  return (
    (items
      ?.map(item => {
        if (isRange(item)) {
          return {
            openStatus: true,
            parentId,
            work: {
              ...item,
              title: getLabelString(item.label),
              totalParts: item.items?.length || 0,
            },
            children: convertStructuresToTree(
              item.items?.filter(item => !isString(item)) as Range[],
              canvases,
              item.id
            ),
          };
        } else if (isCanvas(item)) {
          const transformedCanvas = isTransformedCanvas(item)
            ? item
            : canvases?.find(
                transformedCanvas => item.id === transformedCanvas.id
              );
          const downloads = transformedCanvas
            ? getOriginalFiles(transformedCanvas)
            : [];
          return {
            openStatus: true,
            parentId,
            work: {
              ...transformedCanvas,
              downloads,
              totalParts: 0,
            },
          };
        } else {
          return null;
        }
      })
      .filter(Boolean) as UiTree) || []
  );
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
