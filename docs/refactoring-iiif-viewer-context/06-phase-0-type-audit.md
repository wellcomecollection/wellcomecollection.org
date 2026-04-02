# Phase 0: Type Audit and Cleanup

Duration: 1-2 hours  
Priority: Critical - Must complete before refactoring

## Overview

Before refactoring, audit and fix all types in the ItemViewer section to ensure type safety and catch errors early. Proper typing makes refactoring safer and easier to validate.

## Findings from Actual Codebase

### Types Are Mostly Good! 

The ItemViewer section has mostly well-typed code:
- All components have explicit prop types
- Core types are well-defined in `content/webapp/types/manifest.ts` and `content/webapp/types/item-viewer.ts`
- Most functions have proper return types
- No widespread use of `any`

### Already Using Official IIIF Types

The codebase already uses the official IIIF Presentation 3.0 types:
- Package: `@iiif/presentation-3` (v2.1.3)
- Importing official types: `Manifest`, `Canvas`, `ContentResource`, `ChoiceBody`, `InternationalString`, etc.
- Source: https://iiif.io/api/presentation/3.0/

Custom types extend official types:
```typescript
// TransformedCanvas extends official IIIF Canvas structure
export type TransformedCanvas = {
  id: string;
  type: NonNullable<ResourceType>;  // Uses official ResourceType
  // ... adds Wellcome-specific transformations
  painting: (ChoiceBody | ContentResource)[];  // Uses official types
  metadata: MetadataItem[];  // Uses official MetadataItem
};
```

This is best practice - use official types where available, extend for custom needs.

### Issues Found

#### 1. Implicit `any` in `setSearchResults` (2 locations)

Problem:
```typescript
// content/webapp/contexts/ItemViewerContext/index.tsx
setSearchResults: (v) => void;  // 'v' is implicitly 'any'

// content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.tsx
setSearchResults: (v) => void;  // 'v' is implicitly 'any'
```

Fix:
```typescript
setSearchResults: (v: SearchResults | null) => void;  // OK
```

#### 2. Missing Type Documentation for Common Patterns

While types exist, several commonly-used patterns don't have named types:

Pattern: Image Service Object
```typescript
// Used in multiple files (ZoomedImage.tsx, IIIFViewer.tsx)
const mainImageService = { '@id': currentCanvas?.imageServiceId };
```

Recommendation: Add a named type for clarity:
```typescript
// content/webapp/types/item-viewer.ts
export type ImageService = {
  '@id': string | undefined;
};
```

#### 3. Type Centralisation

Types should live in predictable locations to avoid duplication and confusion:

Current type locations:
- IIIF-related types: `content/webapp/types/manifest.ts`
- ItemViewer-specific types: `content/webapp/types/item-viewer.ts`
- Catalogue API types: `content/webapp/services/wellcome/catalogue/types/`
- Component-specific types: Defined near components when only used locally

Principles for type centralisation:
- Shared types used across multiple features belong in `content/webapp/types/`
- API response types belong near their service in `content/webapp/services/`
- Component-specific types can stay in component files if only used there
- Don't duplicate types - import and reuse existing definitions
- When unsure, check if a type already exists before creating a new one

Check for type duplication:
- Search for similar type names before adding new types
- Look for inline type definitions that could use existing types
- Consolidate multiple definitions of the same concept

Example of good centralisation:
```typescript
// Good: Reusing centralised type
import { TransformedCanvas } from '@weco/content/types/manifest';

// Bad: Redefining what already exists
type MyCanvas = {
  id: string;
  width: number;
  // ... duplicating TransformedCanvas
};
```

## Tasks

### 1. Fix Implicit `any` Types

Files to edit:
- `content/webapp/contexts/ItemViewerContext/index.tsx`
- `content/webapp/views/pages/works/work/IIIFViewer/IIIFViewer.tsx`

Change:
```diff
- setSearchResults: (v) => void;
+ setSearchResults: (v: SearchResults | null) => void;
```

### 2. Add Missing Type Definitions (Optional but Recommended)

File: `content/webapp/types/item-viewer.ts`

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

Data Types:
- `TransformedManifest` - `content/webapp/types/manifest.ts`
- `TransformedCanvas` - `content/webapp/types/manifest.ts`
- `WorkBasic` - `content/webapp/services/wellcome/catalogue/types/work.ts`
- `Work` - `content/webapp/services/wellcome/catalogue/types/index.ts`
- `SearchResults` - `@weco/content/services/iiif/types/search/v3`
- `UiTree` - `@weco/content/views/pages/works/work/work.types`

ItemViewer Types:
- `CanvasRotatedImage` - `content/webapp/types/item-viewer.ts`
- `ItemViewerQuery` - `content/webapp/types/item-viewer.ts`
- `ParentManifest` - `content/webapp/types/item-viewer.ts`

Context Type:
- `Props` (ItemViewerContext) - `content/webapp/contexts/ItemViewerContext/index.tsx`

### 4. Verify Component Prop Types

Check these files have explicit prop types (they do, but verify):
- `IIIFViewer.tsx` - `IIIFViewerProps`
- `ViewerTopBar.tsx` - `ViewerTopBarProps`
- `ZoomedImage.tsx` - `ZoomedImageProps`
- `ImageViewer.tsx` - `ImageViewerProps`
- `MainViewer.tsx` - component props defined inline

All components checked have proper prop types.

### 5. Run TypeScript Compiler

```bash
yarn tsc
```

Fix any errors that appear in `ItemViewer`/`IIIFViewer` files.

### 6. Validate Against Official Specs

Since you're using official IIIF types, verify your custom types align correctly:

Check IIIF Type Usage:
Verified custom types properly use official `@iiif/presentation-3` types
```typescript
//  Good: Using official types directly
import { Canvas, Manifest, ContentResource } from '@iiif/presentation-3';

//  Good: Extending official types
export type TransformedCanvas = {
  // Uses official IIIF types as building blocks
  painting: (ChoiceBody | ContentResource)[];
  metadata: MetadataItem[];
};

//  Avoid: Redefining what IIIF already provides
// Don't create your own Canvas type when @iiif/presentation-3 has one
```

#### Wellcome Catalogue API Types:

Your Catalogue API types (`Work`, `WorkBasic`, `Item`, etc.) are manually defined. Consider centralising those types within the organisation.

## Acceptance Criteria

- [ ] Fixed both `setSearchResults` implicit `any` types
- [ ] (Optional) Added `ImageService` type to `content/webapp/types/item-viewer.ts`
- [ ] Documented existing type structure for reference
- [ ] Checked for duplicate type definitions across files
- [ ] `yarn tsc` runs without errors in ItemViewer files
- [ ] All team members understand what types exist and where they live

## What This Phase Achieves

1. Type Safety - No implicit `any` in critical functions
2. Official Types - Verified use of `@iiif/presentation-3` official IIIF types
3. Documentation - Clear understanding of existing types and their sources
4. Foundation - Solid base for refactoring with confidence
5. Consistency - All types follow same patterns and use official specs where available

## Next Steps

[Phase 0.5: Feature Flag Setup](./07-phase-0.5-feature-flag.md)
