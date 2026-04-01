# Phase 3: Restriction Status

[← Back to Index](./README.md)

**Effort:** 1 hour  
**Risk:** Low  
**Priority:** Low  

## Goal

Add `isCurrentCanvasRestricted` to context instead of calculating it in ViewerTopBar.

## Why?

- ViewerTopBar calculates this value
- Other components might need it too
- Centralise restriction logic in one place
- Clear boolean name makes intent obvious

## Steps

### 3.1 Add to Context Type

**File:** `content/webapp/contexts/ItemViewerContextV2/index.tsx`

```typescript
type Props = {
  // ... existing ...
  isCurrentCanvasRestricted: boolean;  // Current canvas has restricted access
};
```

### 3.2 Calculate in IIIFViewer.refactored.tsx

```typescript
const isCurrentCanvasRestricted = currentCanvas 
  ? hasRestrictedItem(currentCanvas) 
  : false;

<ItemViewerContextV2.Provider value={{
  // ... existing ...
  isCurrentCanvasRestricted,
}}>
```

### 3.3 Update ViewerTopBar.refactored.tsx

```typescript
// REMOVE:
const isRestricted = currentCanvas && hasRestrictedItem(currentCanvas);

// ADD to destructuring:
const { isCurrentCanvasRestricted } = useItemViewerContextV2();

// UPDATE usage:
- {isRestricted && <RestrictedBadge />}
+ {isCurrentCanvasRestricted && <RestrictedBadge />}
```

## Testing

- [ ] Restricted badge appears on restricted canvases
- [ ] Badge doesn't appear on unrestricted canvases
- [ ] Download options respect restriction status

## Success Criteria

- [ ] `isCurrentCanvasRestricted` in context
- [ ] ViewerTopBar uses context value
- [ ] Restricted badge appears correctly

## Time: ~1 hour

---

**Next:** [Phase 4: Duplicate Index Calls](./10-phase-4-duplicate-calls.md)
