# Test-First Methodology

[← Back to Index](./README.md)

**Strategy:** Write comprehensive automated tests BEFORE refactoring to lock in current behaviour. Manual testing is a supplementary safety net, not the primary verification method.

## Why Automated Tests First?

1. **Safety net** - Tests fail immediately if refactoring breaks something
2. **Documentation** - Tests document current behaviour precisely
3. **Confidence** - Can refactor aggressively knowing tests protect you
4. **Regression prevention** - Future changes won't break existing behaviour
5. **Faster feedback** - No need to manually click through every scenario
6. **CI/CD integration** - Tests run automatically on every commit

## Test-First Workflow

For each phase:

1. **Write automated tests FIRST** for current behaviour (characterisation tests)
2. **Verify tests pass** with current implementation (establish baseline)
3. **Make refactoring changes** to implementation
4. **Tests should still pass** (green to green refactor)
5. **Add new tests** for improved functionality if needed
6. **(Optional) Run manual test checklist** for extra confidence

## Test Coverage Requirements

### Before Starting Any Phase

**You MUST have automated tests covering:**

- All derived boolean values (`isCurrentCanvasRestricted`, `hasMultipleCanvases`, etc.)
- All navigation state (`isFirstCanvas`, `canNavigateNext`, etc.)
- All edge cases (undefined canvas, empty manifest, restricted access, etc.)
- Component integration (components actually read from context correctly)

### Minimum Test Files Required

For Phase 1 (Canvas Data), you need:

1. **Context unit tests** - `ItemViewerContextV2.test.tsx`
   - Test all derived canvas data calculations
   - Test all boolean flags
   - Test edge cases (undefined, null, empty arrays)

2. **Component integration tests** - `IIIFViewer.refactored.test.tsx`, `ViewerTopBar.refactored.test.tsx`
   - Verify components consume context values
   - Verify conditional rendering based on boolean flags
   - Verify navigation state affects UI correctly

3. **Mock utilities** - `test-utils.ts`
   - Properly typed mock contexts
   - Reusable test fixtures

See [refactoring-iiif-viewer-context-testing.md](./refactoring-iiif-viewer-context-testing.md) for complete test examples with TypeScript types.

## Test-First Benefits

### What You Get

- **Immediate feedback** - Know instantly if something breaks
- **Refactoring confidence** - Change code fearlessly
- **Living documentation** - Tests show how code should behave
- **Onboarding tool** - New developers learn from tests
- **CI/CD ready** - Automated verification on every push

### What You Avoid

- Manual testing every change
- "Did I break something?" anxiety
- Regression bugs shipping to production
- Time-consuming QA cycles
- Relying on memory for edge cases

## When to Use Manual Testing

Manual testing is **supplementary**, not primary. Use it to:

1. **Verify visual appearance** - Automated tests don't check if UI looks right
2. **Test interactions** - Complex user flows that are hard to automate
3. **Cross-browser testing** - Ensure consistency across browsers
4. **Extra confidence** - Double-check critical paths before release

See [13-testing-strategy.md](./13-testing-strategy.md) for the complete manual testing checklist.

## Red-Green-Refactor Cycle

```
1. RED    - Write failing test (or test for current behaviour)
2. GREEN  - Make test pass with minimal code
3. REFACTOR - Improve code while keeping tests green
```

For this refactoring, we're doing **GREEN to GREEN refactoring**:
- Tests pass with current implementation (GREEN)
- Refactor code
- Tests still pass with new implementation (still GREEN)

##Automated Test Examples

See detailed examples in [refactoring-iiif-viewer-context-testing.md](./refactoring-iiif-viewer-context-testing.md).

Quick example:

```typescript
describe('ItemViewerContextV2 - Navigation Booleans', () => {
  it('should correctly calculate navigation state for first canvas', () => {
    const contextValue = {
      ...mockDefaultContext,
      currentCanvasIndex: 0,
      transformedManifest: { canvases: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }] },
      hasMultipleCanvases: true,
      isFirstCanvas: true,
      isLastCanvas: false,
      canNavigateNext: true,
      canNavigatePrevious: false,
    };

    render(<ItemViewerContextV2.Provider value={contextValue}>
      <ContextValueDisplay />
    </ItemViewerContextV2.Provider>);

    expect(screen.getByTestId('isFirstCanvas')).toHaveTextContent('true');
    expect(screen.getByTestId('canNavigatePrevious')).toHaveTextContent('false');
  });
});
```

---

**Next:** [05 - Feature Flag Strategy](./05-feature-flag-strategy.md)
