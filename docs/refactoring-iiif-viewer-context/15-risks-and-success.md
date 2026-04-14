# Risks & Success Metrics

[← Back to Index](./README.md)

## Risk Mitigation

### Performance Concerns

**Risk:** Adding more data to context could cause unnecessary re-renders across all consuming components.

**Likelihood:** Low  
**Impact:** Medium  

**Mitigation:**
- Use `useMemo` for all derived calculations in context provider
- Test render performance with React DevTools Profiler before and after
- Consider splitting context if it grows too large:
  - `ItemViewerDataContext` (work, manifest, query, derived data)
  - `ItemViewerUIContext` (sidebar, zoom, grid states)
- Monitor bundle size - ensure no significant increase
- Profile with large manifests (100+ canvases)

**Detection:**
- React DevTools shows excessive re-renders
- Lighthouse performance scores decrease
- User reports of lag or slowness

---

### Breaking Changes

**Risk:** Components might depend on local state in ways not immediately obvious. Subtle behaviour changes could occur.

**Likelihood:** Low (with test-first approach)  
**Impact:** High  

**Mitigation:**
- Test-first approach catches regressions immediately
- Feature flag allows instant rollback (disable toggle)
- Keep PR size manageable - merge phases separately if needed
- Side-by-side comparison testing (flag ON vs OFF)
- Comprehensive manual testing checklist
- Monitor Sentry for errors while toggle is public

**Detection:**
- Automated tests fail
- Manual testing reveals differences
- Sentry error spike
- User reports of broken functionality

**Rollback:** Disable toggle or revert default, investigate, fix in development, re-enable.

---

### Normalisation Risk

**Risk:** When normalising variant implementations (e.g., `currentCanvas` calculated differently in `ViewerTopBar` vs `ZoomedImage`), the chosen canonical version might not handle all edge cases that the variants handled.

**Likelihood:** Low (with characterisation tests)  
**Impact:** Medium  

**Mitigation:**
- Write characterisation tests BEFORE refactoring
- Test all edge cases from all variants
- Document why canonical version was chosen
- Review each variant's fallback behaviour
- Side-by-side comparison testing

**Detection:**
- Tests fail during refactoring
- Manual testing reveals edge case failures
- Unexpected undefined/null values

**Rollback:** Fix canonical implementation to handle all edge cases, or disable toggle.

---

### Type Safety Issues

**Risk:** TypeScript type errors during refactoring, especially with complex IIIF types.

**Likelihood:** Medium  
**Impact:** Low (caught at compile time)  

**Mitigation:**
- Update types first before implementation
- Use TypeScript strict mode
- Fix all type errors before testing
- Properly type all mocks and test fixtures
- Use IDE type checking during development
- Run `yarn tsc` frequently during development

**Detection:**
- TypeScript compiler errors
- IDE showing  type errors
- CI/CD build failures

**Resolution:** Fix type errors before proceeding. Don't use `any` or `@ts-ignore` to bypass.

---

### Normalisation Risks

**Risk:** When normalising variant implementations (e.g., `currentCanvas` calculated differently in ViewerTopBar vs ZoomedImage), the chosen canonical version might not handle all edge cases that the variants handled.

**Likelihood:** Low (with comprehensive tests)  
**Impact:** Medium  

**Mitigation:**
- Document all current implementations before refactoring (phase 1.0)
- Test all edge cases from all variants
- Check fallback behaviour (`|| ''` might be needed in some cases, not others)
- Verify with null, undefined, and empty cases
- Compare behaviour with toggle OFF (legacy) vs ON (refactored)

**Detection:**
- Automated tests catch edge case failures
- Manual testing reveals UI differences
- Images don't load correctly
- Zoom doesn't work in specific scenarios

**Resolution:** Adjust canonical implementation to handle all edge cases, or add component-specific logic where genuinely needed.

---

### Feature Flag Debt

**Risk:** Feature flag left in codebase permanently, creating permanent branching logic.

**Likelihood:** Medium (without discipline)  
**Impact:** Medium  

**Mitigation:**
- Set calendar reminder for cleanup (2 weeks after defaulting to ON)
- Include cleanup phase in original plan (Phase 5)
- Document cleanup steps clearly
- Make cleanup PR part of the original epic/project
- Don't consider project "done" until cleanup is merged

**Detection:**
- Feature flag still present months later
- `.legacy.tsx` and `.refactored.tsx` files still in codebase
- Wrapper logic still checking feature flag

**Resolution:** Follow Phase 5 cleanup steps. Remove legacy code, rename refactored code, delete flag.

---

## Success Metrics

### Code Quality Metrics

**Target:** Improvement across all metrics

- **Code reduction:** 150-200 lines removed across components
  - ViewerTopBar: ~65 lines (download logic)
  - IIIFViewer: ~20 lines (calculation logic)
  - ZoomedImage: ~10 lines
  - Other components: ~55-105 lines combined
  
- **DRY improvement:** Zero duplication of:
  - `currentCanvas` calculation (was in 4 files)
  - `queryParamToArrayIndex` calls (was in 3 files)
  - Download options logic (was only in `ViewerTopBar`, now reusable)
  
- **Cyclomatic complexity:** Reduced by ~15-20 points
  - `ViewerTopBar` complexity reduced significantly
  - `IIIFViewer` complexity reduced
  
- **Test coverage:** Increased to >80% for IIIF Viewer components
  - ItemViewerContext: 100% coverage
  - useDownloadOptions: 100% coverage
  - Component integration: >80% coverage

### Maintainability Metrics

**Target:** Easier to understand and modify

- **Single source of truth:** All derived values calculated once, in context
- **Clear naming:** All booleans follow `is/has/can/should` pattern
- **Separation of concerns:** Business logic in context/hooks, presentation in components
- **Reusability:** Download logic hook can be used anywhere
- **Type safety:** All mocks and context values properly typed

### Performance Metrics

**Target:** No regression (same or better performance)

- **Bundle size:** No increase >2KB gzipped
- **Render time:** No increase (verify with React Profiler)
- **Lighthouse score:** Maintain 90+ performance score
- **First Contentful Paint:** Maintain <1.5s
- **Time to Interactive:** Maintain <3s

**How to measure:**
- Before refactoring: Profile with React DevTools, record Lighthouse scores
- After refactoring: Profile again, compare
- Monitor in production with Real User Monitoring (RUM)

### Developer Experience Metrics

**Target:** Easier to work with

- **Onboarding time:** New developers understand viewer code faster
- **Bug fix time:** Easier to locate and fix issues
- **Feature development time:** Easier to add new features
- **Code review time:** PRs easier to review (less mental gymnastics)

**Qualitative feedback:**
- Team survey: "Is the refactored code easier to understand?"
- Code review comments: Fewer questions about "what does this do?"
- Bug reports: Fewer viewer-related bugs after refactor

---

## Success Criteria

The refactoring is successful if:

1. All automated tests pass when toggle is enabled
2. Performance metrics unchanged or improved
3. Error rate in production unchanged
4. Code is more maintainable (team consensus)
5. 150+ lines of code removed
6. Zero duplication of derived calculations
7. Feature flag successfully removed (cleanup complete)
8. Team agrees code is easier to understand

The refactoring has failed if:

1. Tests reveal regressions we can't fix
2. Performance degrades significantly
3. Error rate spikes in production
4. Must revert to legacy implementation
5. Team finds new code harder to understand
6. User-facing bugs introduced

---

## Next Steps

After successfully completing this refactoring:

1. Monitor production metrics for 1-2 weeks with toggle enabled
2. Review team feedback on code maintainability
3. If all success criteria met, proceed to [Phase 5: Cleanup](./12-phase-5-cleanup.md)
4. Consider [Future Improvements](./16-future-improvements.md) like component splitting

For different viewer modes:

```typescript
type ViewerMode = 
  | { type: 'images'; work: ImageWork }
  | { type: 'archive'; work: ArchiveWork; archiveTree: ArchiveTree }
  | { type: 'restricted'; work: RestrictedWork; authStatus: AuthStatus };
```

**Benefit:** Type-safe mode handling

### 3. Extract Search Results Logic

Move search highlighting logic to custom hook:

```typescript
const searchMatches = useSearchMatches(currentCanvas, searchTerm);
```

**Benefit:** Reusable, testable search logic

### 4. Performance Optimizations

- Lazy load large canvases
- Virtual scrolling for 100+ canvas works
- Web Workers for image processing
- Service Worker for offline viewing

**Benefit:** Better performance for large works

---

**See also:**
- [13-testing-strategy.md](./13-testing-strategy.md) - How to verify success
- [13-migration-checklist.md](./13-migration-checklist.md) - Track your progress

---

**Next:** [Future Improvements](./16-future-improvements.md)
