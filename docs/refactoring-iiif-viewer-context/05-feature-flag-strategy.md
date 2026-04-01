# Feature Flag Strategy

[← Back to Index](./README.md)

**Approach:** Build refactored version alongside existing code, controlled by a feature flag. Load entirely different components based on toggle status rather than conditionals within components.

## Why Feature Flag?

1. **Safe rollout** - Users can opt in, test, provide feedback
2. **Instant rollback** - Disable flag if issues arise (no deploy needed)
3. **Production testing** - Validate with real traffic before making it the default
4. **Clean code** - No conditionals littering components
5. **Comparison** - Users can toggle between old/new to compare
6. **Team confidence** - Ship changes knowing you can revert instantly

## Component Structure

```
content/webapp/
├── contexts/
│   ├── ItemViewerContext/           # LEGACY - unchanged
│   │   └── index.tsx
│   └── ItemViewerContextV2/         # NEW - refactored version
│       ├── index.tsx
│       ├── ItemViewerContextV2.test.tsx
│       └── test-utils.ts
│
├── views/pages/works/work/IIIFViewer/
    ├── index.tsx                    # Wrapper - loads old OR new based on flag
    ├── IIIFViewer.legacy.tsx        # Uses ItemViewerContext (old)
    ├── IIIFViewer.refactored.tsx    # Uses ItemViewerContextV2 (new)
    ├── ViewerTopBar.legacy.tsx
    ├── ViewerTopBar.refactored.tsx
    ├── ZoomedImage.legacy.tsx
    ├── ZoomedImage.refactored.tsx
    └── ...
```

**Key insight:** Legacy and refactored versions use different contexts entirely. This means:
- Zero risk to existing implementation
- Can develop new context in isolation
- Can test both versions independently
- Clean deletion when feature flag removed

## Usage Pattern

```typescript
// content/webapp/views/pages/works/work/IIIFViewer/index.tsx
import dynamic from 'next/dynamic';
import { useToggles } from '@weco/toggles/webapp/hooks';
import { IIIFViewerProps } from './types';

const IIIFViewerLegacy = dynamic(() => import('./IIIFViewer.legacy'));
const IIIFViewerRefactored = dynamic(() => import('./IIIFViewer.refactored'));

export default function IIIFViewer(props: IIIFViewerProps) {
  const { iiifViewerRefactored } = useToggles();
  
  if (iiifViewerRefactored) {
    return <IIIFViewerRefactored {...props} />;
  }
  
  return <IIIFViewerLegacy {...props} />;
}
```

## Flag Configuration

**File:** `toggles/webapp/app/toggles.ts`

```typescript
export const toggles = {
  // ... existing toggles ...
  iiifViewerRefactored: {
    id: 'iiifViewerRefactored',
    title: 'IIIF Viewer - Refactored Context',
    defaultValue: false, // Start disabled
    description: 'Use refactored ItemViewerContext with centralised derived values',
  },
};
```

## Rollout Plan

### Phase 1: Development
- Feature flag OFF by default
- Developers can enable locally for testing
- All automated tests must pass with flag ON and OFF

### Phase 2: Internal Testing
- Enable for team members to verify functionality
- Test with real data on staging/production
- Monitor for errors in Sentry

### Phase 3: Public Toggle
- Make toggle publicly available in toggles dashboard
- Users can opt in if they want to try the refactored version
- Monitor metrics (errors, performance, user reports)
- Can disable toggle immediately if issues detected

### Phase 4: Default to ON
- After confidence is high (e.g., 1-2 weeks with no issues)
- Change `defaultValue: false` to `defaultValue: true`
- Users can still opt out if needed
- Continue monitoring

### Phase 5: Cleanup
- After toggle defaulting to ON for 1+ week with no issues
- Remove feature flag entirely
- Delete `.legacy.tsx` files
- Rename `.refactored.tsx` to `.tsx`
- Delete `ItemViewerContext` (old context)
- Rename `ItemViewerContextV2` to `ItemViewerContext`

---

**Next:** [06 - Phase 0: Feature Flag Setup](./06-phase-0-feature-flag.md)
