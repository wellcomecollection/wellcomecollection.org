// Traverse a UiTree and assign sequential canvas indices in tree order
// This ensures that canvas indices match the visual order in the NestedList, including nested folders/ranges.
import { UiTree } from './work.types';

/**
 * Returns a mapping from canvas ID to its sequential index based on a depth-first traversal of the tree.
 * This fixes issues where flat indexing (from the canvases array) does not match the visual tree order.
 *
 * @param tree The hierarchical UiTree (ranges/folders and canvases)
 * @returns Record<string, number> mapping canvas IDs to their tree order index (1-based)
 */
export function getTreeCanvasIndexById(tree: UiTree): Record<string, number> {
  let index = 1;
  const canvasIndexById: Record<string, number> = {};

  // Depth-first traversal: assign index to each canvas node as encountered
  function traverse(nodes: UiTree) {
    for (const node of nodes) {
      // Only canvases get an index; ranges/folders are skipped
      if (node.work.type === 'Canvas') {
        canvasIndexById[node.work.id] = index++;
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
