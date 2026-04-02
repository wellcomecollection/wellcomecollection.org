# Overview

[← Back to Index](./README.md)

## Problem Statement

The IIIF Viewer component tree has significant duplication of logic and calculations across multiple components. Values like `currentCanvas`, download options, image services, and derived state are computed independently in different files, leading to:

- Code duplication (~60% of calculations repeated)
- Harder maintenance (changes needed in multiple places)
- Potential inconsistencies between components
- Missed optimisation opportunities (no memoisation)
- Verbose component code

## Current Architecture

### ItemViewerContext (Already Exists)
**Location:** `content/webapp/contexts/ItemViewerContext/index.tsx`

Currently provides:
- UI state (sidebar visibility, zoom, grid, fullscreen)
- Basic data (work, transformedManifest, query params)
- Refs (viewerRef, mainAreaRef)
- Missing: Derived/computed values used across components

### Components with Duplication

| Component | Duplicated Logic |
|-----------|------------------|
| `IIIFViewer.tsx` | `currentCanvas`, `canvasIndexById`, `hasOnlyRenderableImages`, `hasMultipleCanvases`, `mainImageService`, `urlTemplate` |
| `ViewerTopBar.tsx` | `currentCanvas`, `imageServices` extraction, download options (50+ lines), `isRestricted` |
| `ZoomedImage.tsx` | `currentCanvas`, `mainImageService` |
| `MainViewer.tsx` | `currentCanvas` access, rotation calculations |
| `Thumbnails.tsx` | `queryParamToArrayIndex` calls |
| `NoScriptImage.tsx` | `queryParamToArrayIndex` calls |

### Specific Duplication Examples

**`currentCanvas` - calculated in 4+ files:**
```typescript
// IIIFViewer.tsx line 257
const currentCanvas = transformedManifest?.canvases[queryParamToArrayIndex(canvas)];

// ViewerTopBar.tsx line 224  
const currentCanvas = canvases?.[queryParamToArrayIndex(query.canvas)];

// ZoomedImage.tsx line 55-56
const currentCanvas = transformedManifest?.canvases[queryParamToArrayIndex(query.canvas)];
```

**Download options logic - only in `ViewerTopBar.tsx` (lines 245-291):**
- Calculate `iiifImageDownloadOptions`
- Extract `canvasImageDownloads` from `imageServices`
- Get `canvasDownloadOptions` from current canvas
- Get `manifestDownloadOptions` from rendering
- Get `videoAudioDownloadOptions`
- Combine all options

**Note:** Download logic is only in one file, but it's ~65 lines of complex business logic. **This will go into a custom hook** (not context) for testability and potential reuse.

**Image services extraction - `ViewerTopBar.tsx` (lines 226-238):**
Complex mapping with `ChoiceBody` handling, only done once but could be reusable.

## What Goes Where?

### Context (`ItemViewerContextV2`)
**Use for:** Values needed by **2+ components** OR likely to be needed by multiple components soon.

Moving to context:
- `currentCanvas` - used in 4 files
- `currentCanvasIndex` - used in 3+ files
- `mainImageService` - used in 2 files
- `hasMultipleCanvases` - affects layout across components
- Navigation booleans - used by navigation UI across components
- `isCurrentCanvasRestricted` - only in `ViewerTopBar` now, but likely needed for download restrictions, visibility rules, etc.

### Custom Hook
**Use for:** Complex logic that's **reusable or needs testing**, even if only used in one place.

Moving to hook:
- Download options logic - 65 lines, complex business logic, only in `ViewerTopBar` but worth extracting for testability

### Local Component State
**Use for:** Simple logic only used in **one component** with no reuse potential.

Staying local:
- Component-specific UI state
- Simple calculations not shared
- One-off transformations

---

**Next:** [02 - Normalisation Strategy](./02-normalisation-strategy.md)
