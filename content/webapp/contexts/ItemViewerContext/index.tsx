import { useFeatureFlags } from '@weco/common/server-data/Context';

import ItemViewerContextLegacy, {
  ItemViewerContextProps as ItemViewerContextPropsLegacy,
  useItemViewerContext as useLegacy,
} from './legacy';
import ItemViewerContextRefactored, {
  ItemViewerContextProps as ItemViewerContextPropsRefactored,
  useItemViewerContext as useRefactored,
} from './refactored';

// This barrel exists so that both the legacy and refactored viewer trees
// (see IIIFViewer/index.tsx for where they're switched between, per RFC 086)
// can consume context via one import path during the item-viewer-refactor
// migration. `legacy` is still the live implementation for anyone without
// the `itemViewerRefactor` flag, so its context stays untouched here even as
// `refactored`'s context is free to diverge (new fields, renamed booleans,
// etc.) as the refactor progresses. Once legacy is fully retired, this file
// can be deleted and consumers can import `refactored`'s context directly.

// TODO: Remove after itemViewerRefactor is fully rolled out.
declare global {
  interface Window {
    __ivr_context_logged?: boolean;
  }
}

// Export both contexts for IIIFViewer implementations to use with .Provider
export { ItemViewerContextLegacy, ItemViewerContextRefactored };

// Hook that returns the correct context based on feature flag
export function useItemViewerContext():
  ItemViewerContextPropsLegacy | ItemViewerContextPropsRefactored {
  const { itemViewerRefactor } = useFeatureFlags();
  const legacyContext = useLegacy();
  const refactoredContext = useRefactored();

  // TODO: Remove this console log after itemViewerRefactor is fully rolled out.
  // We guard with __ivr_context_logged because this hook runs on every render
  // of every component that consumes the context — without it, the console
  // would be flooded with duplicate messages.
  if (typeof window !== 'undefined' && !window.__ivr_context_logged) {
    console.log(
      `📦 ItemViewerContext: using ${itemViewerRefactor ? 'REFACTORED' : 'LEGACY'} context`
    );
    window.__ivr_context_logged = true;
  }

  return itemViewerRefactor ? refactoredContext : legacyContext;
}

// Default export to match what the original index.tsx exported
export { ItemViewerContextLegacy as default };
