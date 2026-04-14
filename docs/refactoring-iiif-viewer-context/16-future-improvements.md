# Future Improvements

[← Back to Index](./README.md)

After the main refactoring succeeds, consider these architectural improvements.

## 1. Further Context Splitting

### Problem: Components with Two Faces

Several components have completely different rendering logic based on boolean conditionals, violating the Single Responsibility Principle.

**Example: MainViewer**

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

### Recommendation: Split into Separate Components

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

### Implementation

**File:** `content/webapp/views/pages/works/work/IIIFViewer/MainViewer.tsx`

```typescript
import { FunctionComponent } from 'react';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

// New components (in separate files)
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

**New file:** `VirtualizedImageViewer.tsx`
```typescript
// Only handles image-only works with virtualized scrolling
import { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';

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
      // ... virtualization logic
    >
      {ItemRenderer}
    </FixedSizeList>
  );
};
```

**New file:** `PaginatedItemViewer.tsx`
```typescript
// Only handles mixed content and archives
import { FunctionComponent } from 'react';

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
          item={item}
          canvas={currentCanvas}
          // ... item rendering
        />
      ))}
    </>
  );
};
```

### Other Candidates for Splitting

Look for these patterns:
- Large if/else blocks returning different JSX
- Components with multiple "modes" or "types"
- Boolean props that drastically change behaviour (`hasOnlyRenderableImages`, `isArchive`, `isRestricted`)
- Different event handlers based on conditionals

**Potential candidates in ItemViewer:**
- `IIIFViewer.tsx` - different rendering for image-only vs mixed content
- Any component checking `hasOnlyRenderableImages` extensively

### When NOT to Split

Don't split if:
- It's just conditional rendering of small UI elements (buttons, labels)
- The modes share significant logic
- The conditional is for progressive enhancement (browser support)
- Splitting would create more complexity than it solves

### Testing Strategy

After splitting:
1. Test each component independently with focused test suites
2. Test the router component's decision logic
3. Verify no regressions in E2E tests
4. Check bundle size hasn't increased significantly

---

## 2. Further Context Splitting

If context grows too large or causes performance issues:

```
ItemViewerContext (current)
  ↓
Split into:
  ├── ItemViewerDataContext (work, manifest, derived data)
  └── ItemViewerUIContext (sidebar, zoom, grid, fullscreen)
```

**Benefit:** More granular re-rendering control

**When to do this:** 
- React Profiler shows excessive re-renders
- UI state changes cause data components to re-render unnecessarily
- Context has >20 values

---

## 3. TypeScript Discriminated Unions for Viewer Modes

Make viewer modes type-safe with discriminated unions:

```typescript
type ViewerMode = 
  | { 
      type: 'image-gallery';
      hasOnlyRenderableImages: true;
      canvases: TransformedCanvas[];
    }
  | { 
      type: 'archive';
      hasOnlyRenderableImages: false;
      archiveTree: UiTree;
      currentCanvas: TransformedCanvas;
    }
  | { 
      type: 'restricted';
      hasOnlyRenderableImages: false;
      authStatus: AuthStatus;
    };

type ItemViewerContextProps = {
  // ... common props
  mode: ViewerMode;
};
```

**Benefit:** 
- TypeScript enforces that archive-specific props only exist in archive mode
- Impossible to use `archiveTree` in image-gallery mode (compile error)
- Self-documenting code

---

## 4. Extract Complex State Machines

Use state machine libraries for complex UI state:

```typescript
import { useMachine } from '@xstate/react';

const viewerMachine = createMachine({
  initial: 'loading',
  states: {
    loading: {
      on: { LOADED: 'viewing' }
    },
    viewing: {
      on: { 
        ZOOM: 'zoomed',
        FULLSCREEN: 'fullscreen',
        ERROR: 'error'
      }
    },
    zoomed: {
      on: { CLOSE: 'viewing' }
    },
    // ...
  }
});
```

**When:** Complex state transitions with many edge cases

---

## 5. Performance Monitoring

Add performance instrumentation:

```typescript
import { useReportEffect } from '@weco/common/hooks/useReportEffect';

function ItemViewerContextProvider({ children }) {
  useReportEffect('ItemViewerContext render');
  
  // Mark expensive calculations
  const derivedData = useMemo(() => {
    performance.mark('derive-canvas-data-start');
    const result = deriveCanvasData(manifest, query);
    performance.mark('derive-canvas-data-end');
    performance.measure(
      'derive-canvas-data',
      'derive-canvas-data-start',
      'derive-canvas-data-end'
    );
    return result;
  }, [manifest, query]);
  
  // ...
}
```

Track in production to identify bottlenecks.

---

## Priority Order

1. **Component splitting** - High impact, relatively easy, improves clarity immediately
2. **Context splitting** - Only if performance issues detected
3. **Discriminated unions** - Nice to have, consider if making large type changes
4. **State machines** - Only if state management becomes very complex
5. **Performance monitoring** - Implement if performance concerns arise

Start with component splitting if the main refactoring goes well.