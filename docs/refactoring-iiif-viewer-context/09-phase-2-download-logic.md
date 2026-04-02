# Phase 2: Download Logic Hook

[← Back to Index](./README.md)

**Effort:** 2 hours (tests) + 2 hours (implementation) = **4 hours total**  
**Risk:** Medium (mitigated by tests)  
**Priority:** Medium  

## Goal

Extract download options logic from `ViewerTopBar.tsx` into a reusable custom hook. This removes ~65 lines of complex business logic from the component and makes it testable in isolation.

## Why Extract to a Hook (Not Context)?

**Current problem:** `ViewerTopBar.tsx` has 65+ lines of download option calculations:
- IIIF image downloads
- Canvas image downloads from services
- Canvas rendering downloads (PDFs)
- Manifest downloads
- Video/audio downloads
- ChoiceBody handling

**Why a hook instead of context?**
- Not for context: Only used in `ViewerTopBar` (one component)
- Perfect for hook: Complex logic (65 lines) worth extracting for testability
- Potentially reusable: Other components might need download options in the future

**Solution:** Move all this into `useDownloadOptions` hook:
- Easier to test (no component rendering needed)
- Reusable if other components need download options
- Clearer component code (`ViewerTopBar` focuses on presentation)
- Business logic separate from presentation

## Steps

### 2.1 Write Tests FIRST for `useDownloadOptions` Hook

**File:** `content/webapp/hooks/useDownloadOptions.test.ts`

```typescript
describe('useDownloadOptions', () => {
  it('should return empty array when no canvas or manifest', () => { ... });
  it('should include IIIF image download options', () => { ... });
  it('should include canvas image downloads from services', () => { ... });
  it('should include canvas rendering downloads (PDFs)', () => { ... });
  it('should include manifest-level downloads', () => { ... });
  it('should include video/audio downloads', () => { ... });
  it('should handle ChoiceBody items correctly', () => { ... });
  it('should memoise results and only recalculate when dependencies change', () => { ... });
});

describe('useImageServices', () => {
  it('should extract image services from canvas painting', () => { ... });
  it('should return empty array when no painting items', () => { ... });
  it('should handle undefined currentCanvas', () => { ... });
});
```

**Critical:** Test the complex branches (`ChoiceBody`, video/audio, multiple download types).

### 2.2 Create `useDownloadOptions` Hook

**File:** `content/webapp/hooks/useDownloadOptions.ts`

```typescript
export function useDownloadOptions(iiifImageLocation?: DigitalLocation) {
  const { work, currentCanvas, transformedManifest } = useItemViewerContext();
  const transformedIIIFImage = useTransformedIIIFImage(work);

  return useMemo(() => {
    // Extract image services
    const imageServices = /* ... */;
    
    // Calculate all download options
    const iiifImageDownloadOptions = /* ... */;
    const canvasImageDownloads = /* ... */;
    const canvasDownloadOptions = /* ... */;
    const manifestDownloadOptions = /* ... */;
    const videoAudioDownloadOptions = /* ... */;

    return [
      ...iiifImageDownloadOptions,
      ...canvasImageDownloads,
      ...canvasDownloadOptions,
      ...manifestDownloadOptions,
      ...videoAudioDownloadOptions,
    ];
  }, [currentCanvas, transformedManifest, iiifImageLocation, /* ... */]);
}
```

### 2.3 Update `ViewerTopBar` to Use Hook

**File:** `content/webapp/views/pages/works/work/IIIFViewer/ViewerTopBar.refactored.tsx`

```typescript
// ADD import:
import { useDownloadOptions } from '@weco/content/hooks/useDownloadOptions';

// DELETE lines 226-291 (all download calculation logic)

// REPLACE with:
const downloadOptions = useDownloadOptions(iiifImageLocation);
```

Result: ~65 lines removed from `ViewerTopBar`.

### 2.4 Run Tests

```bash
yarn test useDownloadOptions.test
yarn test ViewerTopBar.refactored.test
```

All should pass.

### 2.5 Manual Testing

- [ ] Download dropdown appears
- [ ] All download options present:
  - [ ] IIIF image downloads (various sizes)
  - [ ] Canvas image downloads
  - [ ] PDF downloads (if applicable)
  - [ ] Manifest downloads (if applicable)
  - [ ] Video/audio downloads (if applicable)
- [ ] Download links work correctly
- [ ] Options update when navigating between canvases

## Success Criteria

- [ ] Tests for `useDownloadOptions` pass
- [ ] `ViewerTopBar` ~65 lines shorter
- [ ] Download dropdown still works identically
- [ ] All download types still appear correctly

## Time Breakdown

- 2 hours: Write comprehensive tests for hook
- 1 hour: Extract logic to hook
- 1 hour: Update ViewerTopBar to use hook
- 30 mins: Manual testing

Total: ~4 hours

---

**Next:** [Phase 3: Restriction Status](./10-phase-3-restriction-status.md)
