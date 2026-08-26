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
  iconSize: 24,
};

// A smaller control for trees where the whole row - not just the chevron -
// is already the click target (the archive collection contents table), so
// the 44px touch-target padding around the icon isn't doing anything there.
// Same shape as controlDimensions (see getControlDimensions below) so
// callers don't need to know which fields exist on which variant.
export const compactControlDimensions = {
  controlWidth: 30,
  controlHeight: 30,
  circleWidth: 30,
  circleHeight: 30,
  circleBorder: 2,
  iconSize: 16,
};

export const getControlDimensions = (isCompact?: boolean) =>
  isCompact ? compactControlDimensions : controlDimensions;

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
  const canvasIds = Object.keys(canvasIndexById);
  const hasCompleteStructure = canvasIds.length === canvases?.length;

  // A canvas referenced from more than one range can leave gaps in the
  // stored indices even though the count still matches, so this can miss
  // even when hasCompleteStructure is true. Arguably we should return
  // undefined rather than fall back to array order below in that case, but
  // it's niche enough (needs a canvas in 2+ ranges) that we're leaving the
  // fallback as-is rather than adding a branch for it.
  // https://github.com/wellcomecollection/wellcomecollection.org/pull/13346#discussion_r3714090012
  const currentCanvasId = hasCompleteStructure
    ? canvasIds.find(id => canvasIndexById[id] === canvas)
    : undefined;

  return currentCanvasId
    ? canvases?.find(c => c.id === currentCanvasId)
    : canvases?.[queryParamToArrayIndex(canvas)];
}

/**
 * Returns the slice of canvases for a given page, shared by every paginated
 * thumbnails view so they can't drift onto different page sizes and disagree
 * about which canvases a given page number shows.
 * @param canvases - The manifest's full canvas list.
 * @param page - 1-based page number.
 * @param pageSize - Canvases per page.
 */
export function getCanvasesForPage({
  canvases,
  page,
  pageSize,
}: {
  canvases: TransformedCanvas[] | undefined;
  page: number;
  pageSize: number;
}): TransformedCanvas[] {
  const startIndex = pageSize * queryParamToArrayIndex(page);

  return [...Array(pageSize)]
    .map((_, i) => canvases?.[startIndex + i])
    .filter((canvas): canvas is TransformedCanvas => Boolean(canvas));
}
