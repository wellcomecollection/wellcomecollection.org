import { Manifest, Range } from '@iiif/presentation-3';

import { isString } from '@weco/common/utils/type-guards';
import { TransformedCanvas } from '@weco/content/types/manifest';
import {
  getLabelString,
  getOriginalFiles,
  isCanvas,
  isRange,
  isTransformedCanvas,
} from '@weco/content/utils/iiif/v3';

import { TreeDataRange, UiTree } from './work.types';

export const controlDimensions = {
  controlWidth: 44,
  controlHeight: 44,
  circleWidth: 30,
  circleHeight: 30,
  circleBorder: 2,
};

function convertStructuresToTree(
  structures: Manifest['structures'],
  canvases: TransformedCanvas[] | undefined,
  parentId: string,
  openByDefault = false
): UiTree {
  const items = structures && structures.length > 0 ? structures : canvases;
  return (
    (items
      ?.map(item => {
        if (isRange(item)) {
          return {
            openStatus: openByDefault,
            parentId,
            data: {
              ...item,
              title: getLabelString(item.label),
              totalParts: item.items?.length || 0,
            },
            children: convertStructuresToTree(
              item.items?.filter(item => !isString(item)) as Range[],
              canvases,
              item.id,
              openByDefault
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
            openStatus: openByDefault,
            parentId,
            data: {
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

export function createDownloadTree(
  structures: Manifest['structures'],
  canvases: TransformedCanvas[] | undefined,
  options?: { skipObjectsNode?: boolean; openByDefault?: boolean }
): UiTree {
  const openByDefault = options?.openByDefault ?? false;
  const downloads = convertStructuresToTree(
    structures,
    canvases,
    'objects',
    openByDefault
  );
  const topLevelItem = {
    openStatus: openByDefault,
    data: {
      id: 'objects',
      type: 'Range',
      title: 'objects',
      label: { en: ['objects'] },
      totalParts: downloads.length,
    } as TreeDataRange,
    children: downloads,
  };
  // If skipObjectsNode is true don't wrap it in an objects range
  if (options?.skipObjectsNode) {
    return downloads;
  }
  return [topLevelItem];
}

// Canvas and manifest params use 1-based indexing, but are used to access items in 0-indexed arrays,
// so we need to convert them in various places
export function queryParamToArrayIndex(canvas: number): number {
  return canvas - 1;
}

export function arrayIndexToQueryParam(canvasIndex: number): number {
  return canvasIndex + 1;
}

// Traverse a UiTree and assign sequential canvas indices in tree order
// This ensures that canvas indices match the visual order in the NestedList, including nested folders/ranges.
export function getTreeCanvasIndexById(tree: UiTree): Record<string, number> {
  let index = 1;
  const canvasIndexById: Record<string, number> = {};

  // Depth-first traversal: assign index to each canvas node as encountered
  function traverse(nodes: UiTree) {
    for (const node of nodes) {
      // Only canvases get an index; ranges/folders are skipped
      if (node.data.type === 'Canvas') {
        canvasIndexById[node.data.id] = index++;
      }
      // Recursively traverse children (if any)
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return canvasIndexById;
}

// Canvas order follows the manifest's structure when we have a complete one -
// that's not always the same as the raw items array order. canvasIndexById
// maps canvas id to structure position; we only trust it when it covers
// every canvas, otherwise we just use the canvas's plain array position.
export function getCurrentCanvas({
  transformedManifest,
  canvasIndexById,
  canvas,
}: {
  transformedManifest: { canvases: TransformedCanvas[] } | undefined;
  canvasIndexById: Record<string, number>;
  canvas: number;
}): TransformedCanvas | undefined {
  const canvases = transformedManifest?.canvases;
  const hasCompleteStructure =
    canvasIndexById && Object.keys(canvasIndexById).length === canvases?.length;
  const currentCanvasId = hasCompleteStructure
    ? Object.keys(canvasIndexById).find(id => canvasIndexById[id] === canvas)
    : undefined;

  return currentCanvasId
    ? canvases?.find(c => c.id === currentCanvasId)
    : canvases?.[queryParamToArrayIndex(canvas)];
}
