# Testing Strategy

[← Back to Index](./README.md)

**Priority:** Automated tests FIRST, manual testing as supplementary safety net.

## Philosophy: Automated Tests Are Primary

**Before writing ANY refactoring code:**
1. Write comprehensive automated tests for current behaviour
2. Verify tests pass (establish baseline)
3. Make refactoring changes
4. Tests still pass (green → green refactoring)
5. (Optional) Run manual testing checklist for extra confidence

**Why automated tests first?**
- Immediate feedback on every change
- No manual clicking through scenarios
- Runs in CI/CD on every commit
- Documents expected behaviour
- Prevents regressions permanently

## Required Automated Test Coverage

### Before Starting Any Phase

You MUST have automated tests covering:

#### Context Unit Tests
**File:** `content/webapp/contexts/ItemViewerContextV2/ItemViewerContextV2.test.tsx`

Test ALL derived values:
- [ ] `currentCanvasIndex` - calculated from query.canvas parameter
- [ ] `currentCanvas` - extracted from transformedManifest.canvases
- [ ] `mainImageService` - extracted from canvas with fallback handling
- [ ] `hasMultipleCanvases` - true when >1 canvas
- [ ] `isCurrentCanvasRestricted` - detects RestrictedAccess condition
- [ ] `isFirstCanvas` - true when currentCanvasIndex === 0
- [ ] `isLastCanvas` - true when at last canvas
- [ ] `canNavigateNext` - !isLastCanvas && hasMultipleCanvases
- [ ] `canNavigatePrevious` - !isFirstCanvas && hasMultipleCanvases
- [ ] `hasIiifImageService` - checks for imageServiceId
- [ ] `isImageZoomable` - checks if zoom is supported
- [ ] `isWorkBornDigital` - checks work.production type

Test all edge cases:
- [ ] Undefined transformedManifest
- [ ] Empty canvases array
- [ ] Canvas without imageServiceId
- [ ] Invalid canvas index (too high)
- [ ] Null/undefined values

#### Component Integration Tests
**Files:** Component `.refactored.test.tsx` files

Test that components actually consume context values:
- [ ] **IIIFViewer.refactored.test.tsx**
  - [ ] Provides currentCanvas to children
  - [  ] Provides navigation booleans to children
  - [ ] Provides boolean flags for conditional rendering
  
- [ ] **ViewerTopBar.refactored.test.tsx**
  - [ ] Uses currentCanvas from context (not calculating)
  - [ ] Uses navigation booleans for button states
  - [ ] Uses isCurrentCanvasRestricted for restriction badge
  - [ ] Uses hasDownloadOptions for download button
  
- [ ] **ZoomedImage.refactored.test.tsx**
  - [ ] Uses currentCanvas from context
  - [ ] Uses mainImageService from context
  - [ ] Handles empty mainImageService correctly

#### Mock Utilities
**File:** `content/webapp/contexts/ItemViewerContextV2/test-utils.ts`

- [ ] mockDefaultContext with proper TypeScript types
- [ ] Helper functions for creating test manifests
- [ ] Helper functions for creating test canvases
- [ ] All mocks properly typed (no `any`)

### Test Examples

See [refactoring-iiif-viewer-context-testing.md](./refactoring-iiif-viewer-context-testing.md) for complete TypeScript test examples.

Quick example:

```typescript
describe('ItemViewerContextV2 - Derived Canvas Data', () => {
  it('should calculate currentCanvasIndex from canvas query param', () => {
    const contextValue: ItemViewerContextV2Props = {
      ...mockDefaultContext,
      query: { canvas: 3, manifest: 1, page: 1, shouldScrollToCanvas: true, query: '' },
      currentCanvasIndex: 2, // canvas=3 → index 2 (1-indexed to 0-indexed)
    };

    render(
      <ItemViewerContextV2.Provider value={contextValue}>
        <ContextValueDisplay />
      </ItemViewerContextV2.Provider>
    );

    expect(screen.getByTestId('currentCanvasIndex')).toHaveTextContent('2');
  });
});
```

## Manual Testing Checklist

**Use this AFTER automated tests pass as an extra safety net.**

### For Each Phase: Core Functionality

- [ ] **Navigate between canvases**
  - [ ] Thumbnails navigation works
  - [ ] Next/Previous buttons work
  - [ ] URL updates with canvas number
  - [ ] Page title updates
  
- [ ] **UI controls**
  - [ ] Sidebar toggle (desktop)
  - [ ] Sidebar toggle (mobile)
  - [ ] Grid view toggle (multi-canvas works only)
  - [ ] Zoom in/out controls
  - [ ] Fullscreen mode
  
- [ ] **Visual appearance**
  - [ ] Layout looks correct
  - [ ] Images load correctly
  - [ ] No console errors
  - [ ] No React warnings

### Different Work Types

Test with these specific work types:

- [ ] **Multi-canvas image work** (`/works/[id]/images`)
  - [ ] Canvas count shows correctly
  - [ ] Grid view available
  - [ ] Navigation between canvases works
  - [ ] Download options appear
  
- [ ] **Single canvas work**
  - [ ] No grid view toggle (should be hidden)
  - [ ] Navigation buttons hidden/disabled
  - [ ] Layout optimised for single canvas
  
- [ ] **Archive items** (`/works/[id]/items`)
  - [ ] Archive tree navigation works
  - [ ] Correct canvas loads from tree selection
  - [ ] Breadcrumb navigation works
  
- [ ] **Restricted access works**
  - [ ] Restriction badge appears
  - [ ] Auth flow works correctly
  - [ ] Restricted content shows after auth
  - [ ] Download disabled for restricted canvas
  
- [ ] **Works with video/audio**
  - [ ] Video player appears
  - [ ] Audio player appears
  - [ ] Download options include video/audio
  
- [ ] **Works with downloadable PDFs**
  - [ ] PDF download option appears
  - [ ] PDF downloads correctly

### Edge Cases

- [ ] **Works with no manifest**
  - [ ] Error message displays gracefully
  - [ ] No JavaScript errors
  
- [ ] **Works with empty canvases**
  - [ ] Handles gracefully
  - [ ] No infinite loops or crashes
  
- [ ] **Missing image services**
  - [ ] Falls back to alternative rendering
  - [ ] No broken images
  
- [ ] **Invalid canvas numbers**
  - [ ] `/works/[id]/items?canvas=999` redirects or shows error
  - [ ] No crashes
  
- [ ] **Canvas without imageServiceId**
  - [ ] Still renders (uses alternative)
  - [ ] Zoom controls hidden
  - [ ] No console errors

### Normalisation-Specific Tests

These are critical when normalising variant implementations:

#### Test `currentCanvas` Normalisation

Different components previously calculated `currentCanvas` differently. Verify they all work:

| Component | Previous Implementation | What to Test |
|-----------|------------------------|--------------|
| ViewerTopBar | `canvases?.[index]` | Download options appear, canvas title shows |
| ZoomedImage | `transformedManifest?.canvases[index]` | Zoom shows correct canvas image |
| MainViewer | May calculate independently | Canvas scrolling works, canvas displays correctly |
| Thumbnails | Used queryParamToArrayIndex directly | Correct thumbnail highlighted |

**Critical:** Open same work with toggle OFF (legacy) and ON (refactored). Verify identical behaviour.

#### Test `mainImageService` Normalisation

**Key question:** Verify the `|| ''` fallback only exists where genuinely needed.

| Component | Previous Implementation | What to Test |
|-----------|------------------------|--------------|
| IIIFViewer | No `\|\| ''` fallback | iiifImageTemplate handles undefined correctly |
| ZoomedImage | Had `\|\| ''` fallback | Verify convertRequestUriToInfoUri still works |

**Test both:**
1. Canvas WITH imageServiceId - zoom should work
2. Canvas WITHOUT imageServiceId - should fall back gracefully, no errors

### Browser Compatibility

**Critical:** Test on all supported browsers BEFORE releasing.

- [ ] **Chrome/Edge** (latest)
  - [ ] All core functionality
  - [ ] Zoom controls
  - [ ] Fullscreen
  - [ ] Downloads
  
- [ ] **Firefox** (latest)
  - [ ] All core functionality
  - [ ] Check for Firefox-specific quirks
  
- [ ] **Safari** (latest macOS)
  - [ ] All core functionality
  - [ ] Image rendering
  - [ ] Fullscreen API differences
  
- [ ] **Mobile Safari** (iOS)
  - [ ] Sidebar toggle works
  - [ ] Touch navigation
  - [ ] Pinch to zoom
  - [ ] Fullscreen on mobile
  
- [ ] **Mobile Chrome** (Android)
  - [ ] Sidebar toggle works
  - [ ] Touch navigation
  - [ ] Downloads work

### Performance Testing

- [ ] **Large manifests** (100+ canvases)
  - [ ] Page loads within 3 seconds
  - [ ] No lag when navigating
  - [ ] Thumbnails load smoothly
  
- [ ] **React DevTools Profiler**
  - [ ] Check for unnecessary re-renders
  - [ ] Verify memoization works
  - [ ] Compare before/after performance

### Comparison Testing (Legacy vs Refactored)

**Most important test:** Side-by-side comparison.

For each work type listed above:
1. Test with feature flag OFF (legacy)
2. Note behaviour, take screenshots
3. Test with feature flag ON ( refactored)
4. Verify IDENTICAL behaviour and appearance
5. Document any differences (should be zero)

## Test Work IDs

Use these specific works for comprehensive testing:

```
// Add actual work IDs here based on production data
- Multi-canvas work: /works/[ID]/images
- Single canvas work: /works/[ID]/images
- Restricted work: /works/[ID]/items
- Video work: /works/[ID]/items
- Archive item: /works/[ID]/items
```

## When Manual Testing Finds Issues

If manual testing reveals a bug that automated tests didn't catch:

1. **Write an automated test for the bug FIRST**
2. Verify the test fails (reproduces the bug)
3. Fix the bug
4. Verify the test passes
5. Add test to permanent test suite

This prevents the bug from reoccurring and improves test coverage.

## Success Criteria

Before marking a phase complete:

**Required:**
- [ ] All automated tests pass with flag OFF (legacy)
- [ ] All automated tests pass with flag ON (refactored)
- [ ] TypeScript compiles with no errors
- [ ] No console warnings or errors
- [ ] Test coverage >80% for new code

**Highly Recommended:**
- [ ] Manual testing checklist completed
- [ ] Tested on all browsers
- [ ] Comparison testing shows identical behaviour
- [ ] Performance profiling shows no regressions

---

**See also:**
- [refactoring-iiif-viewer-context-testing.md](./refactoring-iiif-viewer-context-testing.md) - Complete TypeScript test examples
- [04-test-first-approach.md](./04-test-first-approach.md) - Why we test first
- [12-migration-checklist.md](./12-migration-checklist.md) - Per-phase checklists
