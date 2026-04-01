# Phase 4: Eliminate Duplicate Index Calls

[← Back to Index](./README.md)

**Effort:** 30 minutes  
**Risk:** Low  
**Priority:** Medium  

## Goal

Since `currentCanvasIndex` is now in context (from Phase 1), remove all duplicate `queryParamToArrayIndex(query.canvas)` calls across components.

## Why?

**Before:**
```typescript
// Thumbnails.tsx
const index = queryParamToArrayIndex(query.canvas);

// NoScriptImage.tsx
const index = queryParamToArrayIndex(query.canvas);

// MultipleManifestList.tsx
const index = queryParamToArrayIndex(query.canvas);
```

**Problem:** Same calculation repeated in 3+ files.

**After:**
```typescript
const { currentCanvasIndex } = useItemViewerContextV2();
```

Single source of truth!

## Files to Update

Find all occurrences:

```bash
cd content/webapp
grep -r "queryParamToArrayIndex(query.canvas)" .
```

### Expected files (update each):

1. **Thumbnails.tsx** (lines 38, 49)
2. **NoScriptImage.tsx** (line 42)
3. **MultipleManifestList.tsx** (lines 23, 37)
4. Any others found

### Replace pattern:

```typescript
// OLD:
const index = queryParamToArrayIndex(query.canvas);
// or
queryParamToArrayIndex(query.canvas)

// NEW:
const { currentCanvasIndex } = useItemViewerContextV2();
// or just use currentCanvasIndex directly
```

## Testing

- [ ] Thumbnails highlight correct canvas
- [ ] NoScript image shows correct canvas
- [ ] Multiple manifest list shows correct position
- [ ] All components that use index still work

## Success Criteria

- [ ] No more `queryParamToArrayIndex(query.canvas)` calls in consuming components
- [ ] All components use `currentCanvasIndex` from context
- [ ] Test coverage maintained

## Time: ~30 minutes

---

**Next:** [Phase 5: Cleanup](./11-phase-5-cleanup.md)
