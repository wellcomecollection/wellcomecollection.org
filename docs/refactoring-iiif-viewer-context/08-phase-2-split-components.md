# Phase 2: Split MainViewer Components

[← Back to Index](./README.md)

**Effort:** 3-4 hours  
**Risk:** Low (isolated change, easy to test)  
**Priority:** Required before context refactoring  
**Previous:** [Phase 1: Feature Flag Setup](./07-phase-1-feature-flag.md)  
**Next:** [Phase 3: Canvas Data](./09-phase-3-canvas-data.md)  

## Goal

Split `MainViewer` into separate components for different viewing modes before refactoring the context. This simplifies the context work by allowing each viewer mode to consume only the values it needs.

## Why Do This First?

Component splitting should happen **before** the main context refactoring because:

1. **Simpler context design**: Each viewer type can consume exactly the context values it needs
2. **Clearer testing**: Test each viewer mode independently with focused test suites
3. **Easier refactoring**: Norming context values is simpler when components aren't juggling multiple modes
4. **Better architecture**: Fixes architectural debt before building on top of it

## Problem: MainViewer Has Two Faces

`MainViewer.tsx` has two fundamentally different implementations:

```typescript
if (hasOnlyRenderableImages) {
  // Mode A: Virtualized image scrolling with FixedSizeList
  return <FixedSizeList>{ItemRenderer}</FixedSizeList>;
}

// Mode B: Direct item rendering with IIIFItem components
return <>{displayItems.map(item => <IIIFItem />)}</>;
```

These are two different components with:
- Different data requirements
- Different performance characteristics  
- Different rendering strategies
- Different testing needs

This violates the Single Responsibility Principle and makes the code harder to maintain and test.

## Solution: Split into Separate Components

**Before:**
```
MainViewer
  ├── if (hasOnlyRenderableImages) { FixedSizeList logic }
  └── else { IIIFItem rendering }
```

**After:**
```
MainViewer (router component)
  ├── VirtualizedImageViewer (for image-only works)
  └── PaginatedItemViewer (for mixed content/archives)
```

**Benefits:**
- **Clarity:** Each component has one clear purpose
- **Testability:** Test each mode independently
- **Performance:** Separate bundle chunks, load only what's needed
- **Maintainability:** Changes to one mode don't affect the other
- **Type safety:** Each component has its own specific props
- **Context refactoring:** Each viewer can consume only what it needs

## Implementation Steps

### 2.1 Create VirtualizedImageViewer.tsx

Extract the image-only virtualized scrolling logic into its own component.

**New file:** `content/webapp/views/pages/works/work/IIIFViewer/VirtualizedImageViewer.tsx`

```typescript
// Only handles image-only works with virtualized scrolling
import { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

const VirtualizedImageViewer: FunctionComponent = () => {
  const {
    mainAreaWidth,
    mainAreaHeight,
    canvases,
    rotatedImages,
    // ... only props needed for this mode
  } = useItemViewerContext();
  
  return (
    <FixedSizeList
      width={mainAreaWidth}
      height={mainAreaHeight}
      itemCount={canvases?.length || 0}
      // ... virtualization logic (copy from MainViewer)
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};

export default VirtualizedImageViewer;
```

### 2.2 Create PaginatedItemViewer.tsx

Extract the mixed content and archive rendering logic into its own component.

**New file:** `content/webapp/views/pages/works/work/IIIFViewer/PaginatedItemViewer.tsx`

```typescript
// Only handles mixed content and archives
import { FunctionComponent } from 'react';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import IIIFItem from './IIIFItem';

const PaginatedItemViewer: FunctionComponent = () => {
  const {
    currentCanvas,
    canvases,
    canvas,
    // ... only props needed for this mode
  } = useItemViewerContext();
  
  const displayItems = currentCanvas ? getDisplayItems(currentCanvas) : [];
  
  return (
    <>
      {displayItems.map((item, i) => (
        <IIIFItem
          key={i}
          item={item}
          canvas={currentCanvas}
          // ... item rendering (copy from MainViewer)
        />
      ))}
    </>
  );
};

export default PaginatedItemViewer;
```

### 2.3 Update MainViewer to Router Component

Convert `MainViewer.tsx` into a simple router that chooses which implementation to render.

**File:** `content/webapp/views/pages/works/work/IIIFViewer/MainViewer.tsx`

```typescript
import { FunctionComponent } from 'react';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

// Import both viewer implementations
import VirtualizedImageViewer from './VirtualizedImageViewer';
import PaginatedItemViewer from './PaginatedItemViewer';

const MainViewer: FunctionComponent = () => {
  const { hasOnlyRenderableImages } = useItemViewerContext();
  
  // Router component: decide which implementation to use
  if (hasOnlyRenderableImages) {
    return <VirtualizedImageViewer />;
  }
  
  return <PaginatedItemViewer />;
};

export default MainViewer;
```

### 2.4 Write Tests for Each Component

Create separate test files for each viewer type:

**Tests:**
- `VirtualizedImageViewer.test.tsx` - Test virtualized scrolling behavior
- `PaginatedItemViewer.test.tsx` - Test paginated rendering behavior
- `MainViewer.test.tsx` - Test routing logic

### 2.5 Verify No Regressions

Run existing E2E tests to ensure behavior hasn't changed:
- Image-only works still render correctly
- Archive works still render correctly
- Mixed content works still render correctly

## Testing Checklist

- [ ] VirtualizedImageViewer renders image-only works correctly
- [ ] PaginatedItemViewer renders archive/mixed content correctly
- [ ] MainViewer routes to correct implementation based on `hasOnlyRenderableImages`
- [ ] All E2E tests pass
- [ ] No visual regressions
- [ ] No console errors
- [ ] Bundle size hasn't increased significantly

## Other Candidates for Splitting (Future Work)

After this phase, consider splitting other components with multiple modes:

**Look for these patterns:**
- Large if/else blocks returning different JSX
- Components with multiple "modes" or "types"
- Boolean props that drastically change behaviour
- Different event handlers based on conditionals

**Potential candidates:**
- `IIIFViewer.tsx` - different rendering for image-only vs mixed content
- Any component checking `hasOnlyRenderableImages` extensively

**When NOT to split:**
- Just conditional rendering of small UI elements (buttons, labels)
- The modes share significant logic
- Conditional is for progressive enhancement (browser support)
- Splitting would create more complexity than it solves

## Success Criteria

- [ ] `MainViewer` is a simple router (<20 lines)
- [ ] `VirtualizedImageViewer` handles only image-only works
- [ ] `PaginatedItemViewer` handles only mixed/archive works
- [ ] All tests pass
- [ ] No behavioral changes detected
- [ ] Code is easier to understand and test

## Time Estimate

- Extract VirtualizedImageViewer: 1 hour
- Extract PaginatedItemViewer: 1 hour
- Convert MainViewer to router: 30 minutes
- Write/update tests: 1 hour
- Test and verify: 30 minutes

**Total: 3-4 hours**

---

**Next:** [Phase 3: Canvas Data Context](./09-phase-3-canvas-data.md)
