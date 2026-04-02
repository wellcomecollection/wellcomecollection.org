# Phase 0.5: Feature Flag Setup

[← Back to Index](./README.md)

**Effort:** 1 hour  
**Risk:** None (no behaviour change)  
**Priority:** Required after Phase 0 (Type Audit)  
**Previous:** [Phase 0: Type Audit](./06-phase-0-type-audit.md)  
**Next:** [Phase 1: Canvas Data](./08-phase-1-canvas-data.md)  

## Goal

Set up infrastructure for safe refactoring using feature flags. At the end of this phase, you'll have two identical implementations (legacy and refactored) with the ability to toggle between them.

## Prerequisites

Complete [Phase 0: Type Audit](./06-phase-0-type-audit.md) first to ensure all types are correct before starting refactoring.

## Steps

### 0.1 Add Toggle Definition

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

### 0.2 Create New Context Structure

```bash
# Create new context directory
mkdir -p content/webapp/contexts/ItemViewerContextV2

# Copy existing context as starting point (will be heavily modified in Phase 1)
cp content/webapp/contexts/ItemViewerContext/index.tsx \
   content/webapp/contexts/ItemViewerContextV2/index.tsx
```

**Note:** ItemViewerContextV2 will have the same props initially, but we'll add derived values in Phase 1.

### 0.3 Rename Existing Components to .legacy.tsx

```bash
cd content/webapp/views/pages/works/work/IIIFViewer

# Rename main files
mv IIIFViewer.tsx IIIFViewer.legacy.tsx
mv ViewerTopBar.tsx ViewerTopBar.legacy.tsx
mv ZoomedImage.tsx ZoomedImage.legacy.tsx
mv MainViewer.tsx MainViewer.legacy.tsx
```

### 0.4 Create Wrapper Component

**New file:** `content/webapp/views/pages/works/work/IIIFViewer/index.tsx`

```typescript
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

**Important:** Legacy components import `ItemViewerContext`, refactored components import `ItemViewerContextV2`.

### 0.5 Create Initial .refactored.tsx Files

Copy legacy files to create refactored versions:

```bash
cd content/webapp/views/pages/works/work/IIIFViewer

# Create refactored versions
cp IIIFViewer.legacy.tsx IIIFViewer.refactored.tsx
cp ViewerTopBar.legacy.tsx ViewerTopBar.refactored.tsx
cp ZoomedImage.legacy.tsx ZoomedImage.refactored.tsx
cp MainViewer.legacy.tsx MainViewer.refactored.tsx
```

Update imports in `.refactored.tsx` files:

```typescript
// OLD (in .legacy.tsx files):
import ItemViewerContext from '@weco/common/contexts/ItemViewerContext';

// NEW (in .refactored.tsx files):
import ItemViewerContextV2 from '@weco/common/contexts/ItemViewerContextV2';
```

### 0.6 Verify No Behaviour Change

**Critical:** At this stage, both implementations should be identical.

1. Run: `yarn content`
2. Test viewer on localhost with flag OFF (should use legacy)
3. Enable toggle in toggles dashboard: `/toggles`
4. Test viewer with flag ON (should use refactored - identical behaviour)
5. Confirm toggling between old/new works seamlessly

**Test scenarios:**
- Navigate between canvases (thumbnails, arrows)
- Toggle sidebar
- Zoom in/out
- Fullscreen mode
- Download options
- Restricted items

**Checkpoint:** No user-facing behaviour has changed. You've set up infrastructure with two identical implementations using different contexts.

## Success Criteria

- [ ] Feature flag defined in `toggles.ts`
- [ ] ItemViewerContextV2 created (identical to ItemViewerContext)
- [ ] All original components renamed to `.legacy.tsx`
- [ ] Wrapper component loads legacy or refactored based on flag
- [ ] All `.refactored.tsx` files created and import ItemViewerContextV2
- [ ] Application runs with flag OFF (uses legacy)
- [ ] Application runs with flag ON (uses refactored, identical behaviour)
- [ ] No TypeScript errors
- [ ] No console warnings

## Next Steps

Once Phase 0.5 is complete and verified, proceed to:

**[Phase 1: Canvas Data](./08-phase-1-canvas-data.md)** - Add derived canvas values and boolean flags to context (with automated tests first!)

---

**See also:**
- [Migration Checklist](./13-migration-checklist.md) - Detailed verification steps
- [Feature Flag Strategy](./05-feature-flag-strategy.md) - Why we use feature flags
