# Naming Conventions: Crystal-Clear Boolean Values

[←Back to Index](./README.md)

**Core Principle:** Components should just read clear boolean values from context, not calculate them. No confusing conditionals scattered across components.

## Good vs Bad Naming

Bad (unclear):
```typescript
const restricted = work.access?.restrictedAccessStatus;
const digital = work.production?.some(p => p.type === 'BornDigital');
const imgs = canvases.every(c => c.type === 'Image');
```

Good (crystal clear):
```typescript
const { 
  isCurrentCanvasRestricted,
  isWorkBornDigital,
  hasOnlyRenderableImages,
  hasMultipleCanvases,
  hasIiifImageService,
  hasDownloadableAssets,
  isFullscreenAvailable,
} = useItemViewerContextV2();
```

## Boolean Naming Pattern

All boolean values follow this pattern:
- **`is...`** - for state/status checks (isRestricted, isBornDigital, isFullscreen)
- **`has...`** - for existence checks (hasImages, hasMultipleCanvases, hasDownloadOptions)
- **`can...`** - for permission/ability checks (canDownload, canZoom, canShare)
- **`should...`** - for conditional rendering (shouldShowThumbnails, shouldUseIiifLocation)

## Comprehensive Derived Boolean Values

These should ALL be in `ItemViewerContextV2`, not calculated in components:

### Canvas-Related
```typescript
isCurrentCanvasRestricted: boolean;        // Current canvas has restricted access
hasMultipleCanvases: boolean;              // Work has more than one canvas
isFirstCanvas: boolean;                    // Currently viewing first canvas
isLastCanvas: boolean;                     // Currently viewing last canvas
canNavigateNext: boolean;                  // Next canvas available
canNavigatePrevious: boolean;              // Previous canvas available
```

### Image Service Related
```typescript
hasIiifImageService: boolean;              // Current canvas has IIIF image service
hasIiifImage: boolean;                     // Has IIIF image (service or location)
shouldUseIiifImageLocation: boolean;       // Should use location instead of service
hasOnlyRenderableImages: boolean;          // All canvases are renderable images
isImageZoomable: boolean;                  // Current image supports zoom
```

### Work Type Related
```typescript
isWorkBornDigital: boolean;                // Work was born digital
isArchiveItem: boolean;                    // Work is archive material
hasVideoContent: boolean;                  // Work contains video
hasAudioContent: boolean;                  // Work contains audio
hasPdfDownload: boolean;                   // Work has PDF available
```

### Download Related
```typescript
hasDownloadOptions: boolean;               // Any download options available
hasImageDownloads: boolean;                // Image downloads available
hasManifestDownloads: boolean;             // Manifest-level downloads available
canDownloadCurrentCanvas: boolean;         // Current canvas is downloadable
```

### UI State Related
```typescript
isFullscreenActive: boolean;               // Currently in fullscreen mode
isSidebarVisible: boolean;                 // Sidebar is visible
isGridViewActive: boolean;                 // Grid view is active
isZoomActive: boolean;                     // Zoom is active
canToggleFullscreen: boolean;              // Fullscreen is supported
```

## Benefits of Clear Naming

1. Self-documenting code - `isCurrentCanvasRestricted` needs no comment
2. Easier debugging - Immediately understand what condition is being checked
3. Reduces errors - Less likely to misunderstand intent
4. Better IDE support - Autocomplete shows exactly what's available
5. Easier onboarding - New developers understand code faster

## Component Usage Example

**Before (confusing):**
```typescript
// ViewerTopBar.tsx
const currentCanvas = canvases?.[queryParamToArrayIndex(query.canvas)];
const restricted = currentCanvas?.accessConditions?.some(
  ac => ac.type === 'RestrictedAccess'
);
const imgSvc = currentCanvas?.imageServices?.[0];
```

**After (crystal clear):**
```typescript
// ViewerTopBar.refactored.tsx
const { 
  isCurrentCanvasRestricted,
  hasIiifImageService,
  canDownloadCurrentCanvas,
} = useItemViewerContextV2();

// Component just uses clear values - no calculations!
```

---

**Next:** [04 - Test-First Approach](./04-test-first-approach.md)
