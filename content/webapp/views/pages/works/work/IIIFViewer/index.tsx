import dynamic from 'next/dynamic';

import { useFeatureFlags } from '@weco/common/server-data/Context';

import { IIIFViewerProps as LegacyIIIFViewerProps } from './legacy/IIIFViewer';
import { IIIFViewerProps as RefactoredIIIFViewerProps } from './refactored/IIIFViewer';

// Note: dynamic() server-renders by default (ssr: true is implicit)
// This preserves NoScriptImage functionality for users without JavaScript
const IIIFViewerLegacy = dynamic(() => import('./legacy'));
const IIIFViewerRefactored = dynamic(() => import('./refactored'));

// This is the switch point for the item-viewer-refactor migration (RFC 086:
// https://github.com/wellcomecollection/docs/blob/main/rfcs/086-item-viewer-refactor/README.md).
// `legacy/` is what all users see today; `refactored/` is being built out
// behind the `itemViewerRefactor` feature flag. Once the refactor is fully
// rolled out, `legacy/` (and this switch) can be deleted.
export default function IIIFViewer(
  props: LegacyIIIFViewerProps | RefactoredIIIFViewerProps
) {
  const { itemViewerRefactor } = useFeatureFlags();

  if (itemViewerRefactor) {
    return <IIIFViewerRefactored {...props} />;
  }

  return <IIIFViewerLegacy {...props} />;
}
