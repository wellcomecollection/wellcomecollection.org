# Migration Checklist

[← Back to Index](./README.md)

This checklist helps you track progress through each phase. Check off items as you complete them.

## Before Starting

- [ ] Create feature branch: `refactor/iiif-viewer-context`
- [ ] Ensure all tests pass on main branch
- [ ] Read through all phase documents
- [ ] Understand the test-first workflow

---

## Phase 0: Type Audit and Cleanup

Duration: 1-1.5 hours

- [ ] Fix `setSearchResults: (v) => void` to `setSearchResults: (v: SearchResults | null) => void` in:
  - [ ] `content/webapp/contexts/ItemViewerContext/index.tsx`
  - [ ] `content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.tsx`
- [ ] (Optional) Add `ImageService` type to `content/webapp/types/item-viewer.ts`
- [ ] Document existing type structure in Phase 0 doc
- [ ] Verify custom types properly use `@iiif/presentation-3` official types
- [ ] (Optional) Check if Catalogue API has OpenAPI spec at https://developers.wellcomecollection.org/api/catalogue
- [ ] Run `yarn tsc --noEmit` from root
- [ ] Verify no TypeScript errors in ItemViewer files
- [ ] Commit type fixes

**Time checkpoint:** Should take 1-1.5 hours

---

## Phase 0.5: Feature Flag Setup

**Duration: 1 hour**

- [ ] Add `iiifViewerRefactored` toggle definition in `toggles/webapp/app/toggles.ts`
- [ ] Create `content/webapp/contexts/ItemViewerContextV2` directory
- [ ] Copy ItemViewerContext to ItemViewerContextV2
- [ ] Rename all component files to `.legacy.tsx`
- [ ] Create wrapper component `index.tsx` that switches based on flag
- [ ] Create `.refactored.tsx` files (copies of legacy)
- [ ] Update `.refactored.tsx` imports to use ItemViewerContextV2
- [ ] Run `yarn content` - application starts
- [ ] Test with flag OFF - uses legacy
- [ ] Test with flag ON - uses refactored (identical to legacy)
- [ ] No TypeScript errors
- [ ] No console warnings

**Time checkpoint:** Should take ~1 hour

---

## Phase 1: Derived Canvas Data

### 1.1: Write Automated Tests FIRST

- [ ] Create `content/webapp/contexts/ItemViewerContextV2/ItemViewerContextV2.test.tsx`
- [ ] Create `content/webapp/contexts/ItemViewerContextV2/test-utils.ts` with typed mocks
- [ ] Write tests for all derived canvas data
- [ ] Write tests for all boolean flags
- [ ] Write tests for edge cases (undefined, null, empty)
- [ ] Create `IIIFViewer.refactored.test.tsx` integration tests
- [ ] Create `ViewerTopBar.refactored.test.tsx` component tests
- [ ] Run tests - all pass with current (minimal) implementation

### 1.2 Implementation

- [ ] Add derived values to `IIIFViewer.refactored.tsx` provider
  - [ ] `currentCanvasIndex`
  - [ ] `currentCanvas`
  - [ ] `mainImageService`
  - [ ] `hasMultipleCanvases`
  - [ ] `isFirstCanvas`, `isLastCanvas`
  - [ ] `canNavigateNext`, `canNavigatePrevious`
  - [ ] `isCurrentCanvasRestricted`
  - [ ] `hasIiifImageService`
- [ ] Update `ItemViewerContextV2` type definition
- [ ] Update `ViewerTopBar.refactored.tsx` to use context values
- [ ] Update `ZoomedImage.refactored.tsx` to use context values
- [ ] Update `MainViewer.refactored.tsx` to use context values
- [ ] Update styled components to use `hasMultipleCanvases`

### 1.3 Verification

- [ ] Run automated tests - all pass
- [ ] `yarn tsc` - no TypeScript errors
- [ ] Toggle flag OFF/ON - behaviour identical
- [ ] (Optional) Manual testing checklist from [14-testing-strategy.md](./14-testing-strategy.md)

**Time checkpoint:** Should take ~6-7 hours total (3h tests + 3-4h implementation)

---

## Phase 2: Download Logic Hook

### 2.1 Write Tests FIRST

- [ ] Create `content/webapp/hooks/useDownloadOptions.test.ts`
- [ ] Test empty case (no canvas/manifest)
- [ ] Test IIIF image downloads
- [ ] Test canvas image downloads from services
- [ ] Test canvas rendering downloads (PDFs)
- [ ] Test manifest downloads
- [ ] Test video/audio downloads
- [ ] Test `ChoiceBody` handling
- [ ] Test memoization
- [ ] All tests pass

### 2.2 Implementation

- [ ] Create `content/webapp/hooks/useDownloadOptions.ts`
- [ ] Extract download logic from `ViewerTopBar`
- [ ] Update `ViewerTopBar.refactored.tsx` to use hook
- [ ] Remove ~65 lines from `ViewerTopBar`

### 2.3 Verification

- [ ] Run automated tests - all pass
- [ ] Download dropdown appears
- [ ] All download options present
- [ ] Download links work
- [ ] Options update when navigating canvases

**Time checkpoint:** Should take ~4 hours (2h tests + 2h implementation)

---

## Phase 3: Restriction Status

- [ ] Add `isCurrentCanvasRestricted` to context type
- [ ] Calculate in IIIFViewer.refactored.tsx
- [ ] Update ViewerTopBar.refactored.tsx to use context value
- [ ] Remove local calculation from ViewerTopBar
- [ ] Test restricted badge appears correctly
- [ ] Test download options respect restriction

**Time checkpoint:** Should take ~1 hour

---

## Phase 4: Duplicate Index Calls

- [ ] Find all `queryParamToArrayIndex(query.canvas)` calls
- [ ] Update Thumbnails.tsx to use `currentCanvasIndex` from context
- [ ] Update NoScriptImage.tsx to use `currentCanvasIndex`
- [ ] Update MultipleManifestList.tsx to use `currentCanvasIndex`
- [ ] Update any other files found
- [ ] Test thumbnails highlight correctly
- [ ] Test all navigation works

**Time checkpoint:** Should take ~30 minutes

---

## Phase 5: Cleanup (After Defaulting to ON)

**Only do this after toggle defaults to ON for 1+ week with no issues!**

- [ ] Remove feature flag from `toggles.ts`
- [ ] Delete all `.legacy.tsx` files- [ ] Rename `.refactored.tsx` to `.tsx`
- [ ] Delete wrapper `index.tsx`
- [ ] Delete old `ItemViewerContext` directory
- [ ] Rename `ItemViewerContextV2` to `ItemViewerContext`
- [ ] Update all imports from V2 to standard
- [ ] Rename test files (remove .refactored)
- [ ] Update test imports
- [ ] Run all tests - still pass
- [ ] `yarn tsc` - no errors
- [ ] Application runs correctly

**Time checkpoint:** Should take ~1-2 hours

---

## Final Verification

- [ ] All automated tests pass
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Feature flag works (or removed if cleanup done)
- [ ] Manual testing on all browsers
- [ ] Performance metrics unchanged
- [ ] Code is cleaner and more maintainable
- [ ] Documentation updated

---

## Rollout Checklist

- [ ] **Internal testing** - Enable for team members, verify functionality
- [ ] **Make toggle public** - Available in toggles dashboard for anyone to enable
- [ ] **Monitor** - Watch Sentry, user reports, performance metrics
- [ ] **Wait 1-2 weeks** - Let users opt in, gather feedback
- [ ] **Default to ON** - Change defaultValue to true (users can still opt out)
- [ ] **Monitor more** - Watch for issues with new default
- [ ] **Wait 1+ week** - Ensure stability with new default
- [ ] **Cleanup** - Remove feature flag entirely (Phase 5)

**If issues at any stage:** Disable toggle or revert default, investigate, fix, try again.

---

## Total Time Estimate

- Phase 0: 1 hour
- Phase 1: 6-7 hours
- Phase 2: 4 hours
- Phase 3: 1 hour
- Phase 4: 30 minutes
- Phase 5: 1-2 hours

**Total: 13.5-15.5 hours**

(Original estimate was 10-13 hours, but automated testing adds time upfront that saves debugging time later)
