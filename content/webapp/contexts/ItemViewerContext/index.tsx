import { useFeatureFlags } from '@weco/common/server-data/Context';

import ItemViewerContextLegacy, {
  defaultItemViewerContext,
  ItemViewerContextProps,
  results,
  useItemViewerContext as useLegacy,
} from './legacy';
import ItemViewerContextRefactored, {
  useItemViewerContext as useRefactored,
} from './refactored';

// TODO: Remove after testing
declare global {
  interface Window {
    __ivr_context_logged?: boolean;
  }
}

// Export types and defaults (same in both versions)
export type { ItemViewerContextProps };
export { defaultItemViewerContext, results };

// Export both contexts for IIIFViewer implementations to use with .Provider
export { ItemViewerContextLegacy, ItemViewerContextRefactored };

// Hook that returns the correct context based on feature flag
export function useItemViewerContext(): ItemViewerContextProps {
  const { itemViewerRefactor } = useFeatureFlags();
  const legacyContext = useLegacy();
  const refactoredContext = useRefactored();

  // TODO: Remove this console log after itemViewerRefactor is fully rolled out
  if (typeof window !== 'undefined' && !window.__ivr_context_logged) {
    console.log(
      `📦 ItemViewerContext: using ${itemViewerRefactor ? 'REFACTORED' : 'LEGACY'} context`
    );
    window.__ivr_context_logged = true;
  }

  return itemViewerRefactor ? refactoredContext : legacyContext;
}

// Default export for legacy compatibility (but IIIFViewer should use named exports)
export default ItemViewerContextLegacy;
