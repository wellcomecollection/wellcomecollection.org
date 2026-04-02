# Phase 1: Canvas Data to Context

[← Back to Index](./README.md)

**Effort:** 3 hours (tests) + 3-4 hours (refactoring) = **6-7 hours total**  
**Risk:** Low (tests prevent regressions)  
**Priority:** High (foundation for other phases)  

## Goal

Add derived canvas data and boolean flags that are **used by multiple components** to ItemViewerContextV2. Components read these values instead of calculating them independently.

**Decision criteria:** Only add to context if:
1. Value is calculated in 2+ components (eliminates duplication), OR
2. Value will likely be needed by multiple components soon (e.g., `isCurrentCanvasRestricted` for download restrictions)

**Note:** Download logic stays OUT of context (goes to a hook instead) because it's only used in ViewerTopBar.

## Critical: Automated Tests FIRST

**Before writing any implementation code, you MUST:**

1. Write comprehensive automated tests for all derived values
2. Verify tests pass with current implementation
3. Then and only then make refactoring changes

See [refactoring-iiif-viewer-context-testing.md](./refactoring-iiif-viewer-context-testing.md) for complete test examples with TypeScript types.

## Steps Overview

### 1.1 Write Characterisation Tests FIRST (3 hours)

**Files to create:**
- `content/webapp/contexts/ItemViewerContextV2/ItemViewerContextV2.test.tsx` - Context unit tests
- `content/webapp/contexts/ItemViewerContextV2/test-utils.ts` - Properly typed mocks
- `content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.refactored.test.tsx` - Integration tests
- `content/webapp/views/pages/works/work/IIIFViewer/ViewerTopBar.refactored.test.tsx` - Component tests

**Test coverage required:**
- All derived canvas data (`currentCanvas`, `currentCanvasIndex`, `mainImageService`)
- All boolean flags (`hasMultipleCanvases`, `isFirstCanvas`, `canNavigateNext`, etc.)
- All edge cases (undefined manifest, empty canvases, invalid index)
- Component integration (verify components consume context)

See [Testing Guide](./refactoring-iiif-viewer-context-testing.md) for complete examples.

### 1.2 Make Tests Pass (Implementation)

Once tests are written, add the derived values to IIIFViewer.refactored.tsx:

```typescript
// Derived canvas data
const currentCanvasIndex = queryParamToArrayIndex(canvas);
const currentCanvas = transformedManifest?.canvases[currentCanvasIndex];
const totalCanvases = transformedManifest?.canvases?.length || 0;

// Canvas-related booleans (crystal clear!)
const hasMultipleCanvases = totalCanvases > 1;
const isFirstCanvas = currentCanvasIndex === 0;
const isLastCanvas = currentCanvasIndex === totalCanvases - 1;
const canNavigateNext = !isLastCanvas && hasMultipleCanvases;
const canNavigatePrevious = !isFirstCanvas && hasMultipleCanvases;
const isCurrentCanvasRestricted = Boolean(
  currentCanvas?.accessConditions?.some(ac => ac.type === 'RestrictedAccess')
);

// Image service data
const mainImageService = { '@id': currentCanvas?.imageServiceId || '' };
const hasIiifImageService = Boolean(currentCanvas?.imageServiceId);

// Add to context provider
<ItemViewerContextV2.Provider value={{
  // ... existing ...
  currentCanvasIndex,
  currentCanvas,
  mainImageService,
  hasMultipleCanvases,
  isFirstCanvas,
  isLastCanvas,
  canNavigateNext,
  canNavigatePrevious,
  isCurrentCanvasRestricted,
  hasIiifImageService,
}}>
```

### 1.3 Update `ItemViewerContextV2` Types

Add all new props to the TypeScript interface with clear types.

### 1.4 Update Components to Use Context

**`ViewerTopBar.refactored.tsx`** - Remove local calculations, use context:
```typescript
const {
  currentCanvas,
  isCurrentCanvasRestricted,
  canNavigateNext,
  canNavigatePrevious,
} = useItemViewerContextV2();

// Delete all local currentCanvas calculations
// Use values directly from context
```

**`ZoomedImage.refactored.tsx`** - Use `currentCanvas` and `mainImageService` from context

**`MainViewer.refactored.tsx`** - Use `currentCanvas` from context

**Styled components** - Use `hasMultipleCanvases` from context

### 1.5 Run Automated Tests

```bash
yarn test ItemViewerContextV2.test
yarn test IIIFViewer.refactored
yarn test ViewerTopBar.refactored
```

All tests should pass.

### 1.6 (Optional) Manual Testing

See [13-testing-strategy.md](./13-testing-strategy.md) for comprehensive manual testing checklist.

**Quick smoke tests:**
- [ ] Viewer loads correctly
- [ ] Navigate between canvases
- [ ] Toggle sidebar/grid
- [ ] Verify download options appear

## Why Crystal-Clear Boolean Naming Matters

**Before (confusing):**
```typescript
const hasNext = idx < canvases.length - 1 && canvases.length > 1;
<NextButton disabled={!hasNext} />
```

**After (crystal clear):**
```typescript
const { canNavigateNext } = useItemViewerContextV2();
<NextButton disabled={!canNavigateNext} />
```

Self-documenting code! No mental gymnastics required.

## Success Criteria

- [ ] All automated tests pass (context + components)
- [ ] TypeScript compiles with no errors
- [ ] Components use context values (not calculating locally)
- [ ] Feature flag toggle works (old vs new identical behaviour)
- [ ] Manual testing checklist complete (optional)

## Time Breakdown

- 3 hours: Write comprehensive automated tests
- 2 hours: Add derived values to context
- 1-2 hours: Update components to use context
- 30 mins: Run tests and verify

Total: 6-7 hours

---

**Next:** [Phase 2: Download Logic](./09-phase-2-download-logic.md)
