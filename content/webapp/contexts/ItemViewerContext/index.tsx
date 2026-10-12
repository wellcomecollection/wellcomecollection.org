import ItemViewerContextRefactored, {
  ItemViewerContextProps as ItemViewerContextPropsRefactored,
  useItemViewerContext as useRefactored,
} from './refactored';

// This barrel used to switch between a legacy and a refactored context
// depending on the `itemViewerRefactor` flag (see RFC 086). Legacy is gone
// now, so this just re-exports the one remaining context. The barrel and
// `refactored.tsx` will fold into a single file in a follow-up step.

export { ItemViewerContextRefactored };

export function useItemViewerContext(): ItemViewerContextPropsRefactored {
  return useRefactored();
}
