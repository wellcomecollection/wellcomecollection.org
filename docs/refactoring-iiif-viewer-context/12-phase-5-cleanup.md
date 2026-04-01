# Phase 5: Cleanup

[← Back to Index](./README.md)

**Effort:** 1-2 hours  
**Risk:** Low  
**Priority:** Required (after toggle has been defaulted to ON)  

## Goal

Clean up feature flag infrastructure after successful adoption. Remove legacy code, rename refactored files, and finalize the implementation.

## When to Do This

**Only after:**
- Toggle defaulted to ON for 1+ week
- No issues reported
- All metrics stable
- Team confidence is high

## Steps

### 5.1 Remove Feature Flag

**File:** `toggles/webapp/app/toggles.ts`

```typescript
// DELETE:
iiifViewerRefactored: {
  id: 'iiifViewerRefactored',
  title: 'IIIF Viewer - Refactored Context',
  defaultValue: false,
  description: 'Use refactored ItemViewerContext with centralised derived values',
},
```

### 5.2 Delete Legacy Files

```bash
cd content/webapp/views/pages/works/work/IIIFViewer

# Delete all .legacy.tsx files
rm IIIFViewer.legacy.tsx
rm ViewerTopBar.legacy.tsx
rm ZoomedImage.legacy.tsx
rm MainViewer.legacy.tsx
# ... any other .legacy.tsx files
```

### 5.3 Rename Refactored Files to Standard Names

```bash
# Rename .refactored.tsx to .tsx
mv IIIFViewer.refactored.tsx IIIFViewer.tsx
mv ViewerTopBar.refactored.tsx ViewerTopBar.tsx
mv ZoomedImage.refactored.tsx ZoomedImage.tsx
mv MainViewer.refactored.tsx MainViewer.tsx
```

### 5.4 Delete Wrapper Component

```bash
# No longer needed - IIIFViewer.tsx is now the main component
rm index.tsx  # The wrapper that switched between legacy/refactored
```

### 5.5 Rename Context

```bash
# Delete old context
rm -rf content/webapp/contexts/ItemViewerContext

# Rename new context to standard name
mv content/webapp/contexts/ItemViewerContextV2 \
   content/webapp/contexts/ItemViewerContext
```

### 5.6 Update All Imports

Replace all occurrences of `ItemViewerContextV2` with `ItemViewerContext`:

```bash
# Find all imports
grep -r "ItemViewerContextV2" content/webapp

# Update each file:
# OLD: import ItemViewerContextV2 from '@weco/common/contexts/ItemViewerContextV2';
# NEW: import ItemViewerContext from '@weco/common/contexts/ItemViewerContext';
```

### 5.7 Remove Unused Props

Identify components that can drop props now that context provides the data:

```typescript
// Example: ViewerTopBar might have received props that context now provides
// Remove those props from the interface and component
```

### 5.8 Update Tests

Rename test files and update imports:

```bash
mv ItemViewerContextV2.test.tsx ItemViewerContext.test.tsx
mv IIIFViewer.refactored.test.tsx IIIFViewer.test.tsx
# Update imports in test files from V2 to standard
```

### 5.9 Type Cleanup

Ensure all TypeScript types reflect the final context shape. Remove any temporary types used during migration.

### 5.10 Documentation

- [ ] Update inline comments if needed
- [ ] Remove any "TODO: remove after refactor" comments
- [ ] Update component documentation if it references old structure

## Success Criteria

- [ ] No more .legacy.tsx files
- [ ] No more .refactored.tsx files
- [ ] No ItemViewerContextV2 references
- [ ] Feature flag removed from toggles
- [ ] All tests still pass
- [ ] TypeScript compiles with no errors
- [ ] Application runs correctly
- [ ] Code is clean and maintainable

## Time: 1-2 hours

---

The IIIF Viewer context refactoring is complete!

**See also:**
- [14-risks-and-success.md](./14-risks-and-success.md) - Final success metrics
