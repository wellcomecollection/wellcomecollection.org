# Phase 0: Type Audit and Cleanup

**Duration:** 1-2 hours  
**Priority:** Critical - Must complete before refactoring

## Overview

Before refactoring, audit and fix all types in the ItemViewer section to ensure type safety and catch errors early. Proper typing makes refactoring safer and easier to validate.

## Findings from Actual Codebase

### Types Are Mostly Good! ✓

The ItemViewer section has **mostly well-typed code**:
- All components have explicit prop types
- Core types are well-defined in `content/webapp/types/manifest.ts` and `content/webapp/types/item-viewer.ts`
- Most functions have proper return types
- No widespread use of `any`

### Issues Found

#### 1. Implicit `any` in `setSearchResults` (2 locations)

**Problem:**
```typescript
// content/webapp/contexts/ItemViewerContext/index.tsx (line 23)
setSearchResults: (v) => void;  // ❌ 'v' is implicitly 'any'

// content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.tsx (line 45)
setSearchResults: (v) => void;  // ❌ 'v' is implicitly 'any'
```

**Fix:**
```typescript
setSearchResults: (v: SearchResults | null) => void;  // ✅
```

#### 2. Missing Type Documentation for Common Patterns

While types exist, several commonly-used patterns don't have named types:

**Pattern: Image Service Object**
```typescript
// Used in multiple files (ZoomedImage.tsx, IIIFViewer.tsx)
const mainImageService = { '@id': currentCanvas?.imageServiceId };
```

**Recommendation:** Add a named type for clarity:
```typescript
// content/webapp/types/item-viewer.ts
export type ImageService = {
  '@id': string | undefined;
};
```

## Tasks

### 1. Fix Implicit `any` Types

**Files to edit:**
- `content/webapp/contexts/ItemViewerContext/index.tsx` (line 23)
- `content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.tsx` (line 45)

**Change:**
```diff
- setSearchResults: (v) => void;
+ setSearchResults: (v: SearchResults | null) => void;
```

### 2. Add Missing Type Definitions (Optional but Recommended)

**File:** `content/webapp/types/item-viewer.ts`

Add type for image service pattern:

```typescript
import { Canvas, Manifest } from '@iiif/presentation-3';

// Existing types (keep)
export type CanvasRotatedImage = { canvas: number; rotation: number };

export type ItemViewerQuery = {
  canvas: number;
  manifest: number;
  query: string;
  page: number;
  shouldScrollToCanvas: boolean;
};

export type ParentManifest = Pick<Manifest, 'behavior'> & {
  canvases: Pick<Canvas, 'id' | 'label'>[];
};

// NEW: Add image service type for common pattern
export type ImageService = {
  '@id': string | undefined;
};
```

This makes the pattern explicit and easier to understand when refactoring.

### 3. Document Existing Type Structure

Before refactoring, understand what types are already available:

**Data Types:**
- `TransformedManifest` - `content/webapp/types/manifest.ts` (line 78)
- `TransformedCanvas` - `content/webapp/types/manifest.ts` (line 39)
- `WorkBasic` - `content/webapp/services/wellcome/catalogue/types/work.ts` (line 14)
- `Work` - `content/webapp/services/wellcome/catalogue/types/index.ts` (line 35)
- `SearchResults` - `@weco/content/services/iiif/types/search/v3`
- `UiTree` - `@weco/content/views/pages/works/work/work.types`

**ItemViewer Types:**
- `CanvasRotatedImage` - `content/webapp/types/item-viewer.ts` (line 3)
- `ItemViewerQuery` - `content/webapp/types/item-viewer.ts` (line 5)
- `ParentManifest` - `content/webapp/types/item-viewer.ts` (line 13)

**Context Type:**
- `Props` (ItemViewerContext) - `content/webapp/contexts/ItemViewerContext/index.tsx` (line 16)

### 4. Verify Component Prop Types

**Check these files have explicit prop types** (they do, but verify):
- `IIIFViewer.tsx` - `IIIFViewerProps` (line 38)
- `ViewerTopBar.tsx` - `ViewerTopBarProps` (line 194)
- `ZoomedImage.tsx` - `ZoomedImageProps` (line 48)
- `ImageViewer.tsx` - `ImageViewerProps` (line 43)
- `MainViewer.tsx` - Component props defined inline

All components checked have proper prop types. ✓

### 5. Run TypeScript Compiler

```bash
cd /Users/cantinr/Projects/wellcomecollection.org
yarn tsc --noEmit
```

Fix any errors that appear in ItemViewer/IIIFViewer files.

## Acceptance Criteria

- [ ] Fixed both `setSearchResults` implicit `any` types
- [ ] (Optional) Added `ImageService` type to `content/webapp/types/item-viewer.ts`
- [ ] Documented existing type structure for reference
- [ ] `yarn tsc --noEmit` runs without errors in ItemViewer files
- [ ] All team members understand what types exist and where they live

## What This Phase Achieves

1. **Type Safety** - No implicit `any` in critical functions
2. **Documentation** - Clear understanding of existing types
3. **Foundation** - Solid base for refactoring with confidence
4. **Consistency** - All types follow same patterns

## Time Estimate

- Fix implicit `any` types: 10 minutes
- Add optional `ImageService` type: 5 minutes
- Document existing types: 15 minutes
- Run tsc and verify: 15-30 minutes
- **Total: 45-60 minutes** (much faster than originally estimated!)

## Next Steps

After completing this phase:
1. [Phase 0.5: Feature Flag Setup](./07-phase-0.5-feature-flag.md) (1 hour)
2. [Phase 1: Canvas Data Refactoring](./08-phase-1-canvas-data.md) (6-7 hours)
