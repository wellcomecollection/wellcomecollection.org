import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/work.helpers';

export function useCurrentCanvas(): TransformedCanvas | undefined {
  const { transformedManifest, canvasIndexById, query } =
    useItemViewerContext();
  const { canvas } = query;
  const canvases = transformedManifest?.canvases;

  // Canvas order is determined by structures if we have them, which aren't always the same
  // as the order of canvases in the items array.
  // The canvasIndexById provides a mapping between the canvas ID
  // and the correct display index based on the archival structure.
  // We only use this mapping if it contains all canvases to ensure consistent ordering -
  // otherwise we fall back to array indexing.
  const hasCompleteStructure =
    canvasIndexById && Object.keys(canvasIndexById).length === canvases?.length;
  const currentCanvasId = hasCompleteStructure
    ? Object.keys(canvasIndexById).find(id => canvasIndexById[id] === canvas)
    : undefined;

  return currentCanvasId
    ? canvases?.find(c => c.id === currentCanvasId)
    : canvases?.[queryParamToArrayIndex(canvas)];
}
