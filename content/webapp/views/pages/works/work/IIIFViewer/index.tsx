import dynamic from 'next/dynamic';

import { useFeatureFlags } from '@weco/common/server-data/Context';

import { IIIFViewerProps as LegacyIIIFViewerProps } from './legacy/IIIFViewer';
import { IIIFViewerProps as RefactoredIIIFViewerProps } from './refactored/IIIFViewer';

// Note: dynamic() server-renders by default (ssr: true is implicit)
// This preserves NoScriptImage functionality for users without JavaScript
const IIIFViewerLegacy = dynamic(() => import('./legacy'));
const IIIFViewerRefactored = dynamic(() => import('./refactored'));

export default function IIIFViewer(
  props: LegacyIIIFViewerProps | RefactoredIIIFViewerProps
) {
  const { itemViewerRefactor } = useFeatureFlags();

  if (itemViewerRefactor) {
    return <IIIFViewerRefactored {...props} />;
  }

  return <IIIFViewerLegacy {...props} />;
}
