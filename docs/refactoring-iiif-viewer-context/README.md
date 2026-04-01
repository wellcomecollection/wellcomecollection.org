# IIIF Viewer Context Refactoring

**Status:** Not started  
**Created:** 1 April 2026  
**Estimated effort:** 11-14 hours  
**Priority:** Medium  

## Quick Start

This folder contains a comprehensive plan to refactor the IIIF Viewer context to eliminate code duplication and centralise derived state calculations.

**Key principle:** Write automated tests BEFORE refactoring (test-first approach), then use manual testing for extra confidence.

## Table of Contents

### Understanding the Problem
- [01 - Overview](./01-overview.md) - Problem statement, current architecture, and duplication examples
- [02 - Normalisation Strategy](./02-normalisation-strategy.md) - Why and how we normalise variant implementations
- [03 - Naming Conventions](./03-naming-conventions.md) - Crystal-clear boolean naming patterns

### Approach
- [04 - Test-First Methodology](./04-test-first-approach.md) - **Write tests BEFORE refactoring** (automated tests are priority)
- [05 - Feature Flag Strategy](./05-feature-flag-strategy.md) - Safe rollout with feature flags

### Implementation Phases
- [06 - Phase 0: Type Audit](./06-phase-0-type-audit.md) (45-60 mins) - **Do this first: Fix implicit `any` types**
- [07 - Phase 0.5: Feature Flag Setup](./07-phase-0.5-feature-flag.md) (1 hour)
- [08 - Phase 1: Canvas Data](./08-phase-1-canvas-data.md) (6-7 hours) - **Includes comprehensive automated tests**
- [09 - Phase 2: Download Logic](./09-phase-2-download-logic.md) (2 hours)
- [10 - Phase 3: Restriction Status](./10-phase-3-restriction-status.md) (1 hour)
- [11 - Phase 4: Duplicate Index Calls](./11-phase-4-duplicate-calls.md) (30 mins)
- [12 - Phase 5: Cleanup](./12-phase-5-cleanup.md) (1-2 hours)

### Reference
- [13 - Migration Checklist](./13-migration-checklist.md) - Step-by-step checklist for each phase
- [14 - Testing Strategy](./14-testing-strategy.md) - **Automated tests (priority) + manual testing checklist**
- [15 - Risks & Success Metrics](./15-risks-and-success.md) - Risk mitigation and success criteria
- [Testing Guide](./refactoring-iiif-viewer-context-testing.md) - Detailed test examples with TypeScript types

## Quick Navigation

### I want to understand the refactoring
Start with [01-overview.md](./01-overview.md)

### I want to implement Phase 1
Read [08-phase-1-canvas-data.md](./08-phase-1-canvas-data.md) and [Testing Guide](./refactoring-iiif-viewer-context-testing.md)

### I want to see test examples
Go to [Testing Guide](./refactoring-iiif-viewer-context-testing.md) for complete TypeScript test examples

### I want the testing checklist
See [14-testing-strategy.md](./14-testing-strategy.md) for automated test requirements and manual testing checklist

## Key Principles

1. **Fix types first** - Audit and fix all types before refactoring (Phase 0)
2. **Automated tests BEFORE refactoring** - Build comprehensive test coverage first
3. **Feature flag everything** - Safe rollout with instant rollback capability
4. **Crystal-clear naming** - Use `is...`, `has...`, `can...`, `should...` patterns for booleans
5. **Test-first workflow** - Green to Green refactoring (tests pass before and after)
6. **Manual tests as backup** - Comprehensive checklist for extra confidence
7. **Context for shared state only** - Only add to context if used by 2+ components or likely to be needed soon
8. **Hooks for complex logic** - Extract to custom hooks for testability, even if only used once

## Progress Tracking

- [ ] Phase 0: Feature Flag Setup
- [ ] Phase 1: Canvas Data (with automated tests)
- [ ] Phase 2: Download Logic
- [ ] Phase 3: Restriction Status
- [ ] Phase 4: Duplicate Calls
- [ ] Phase 5: Cleanup

---

**Related Documentation:**
- [AGENTS.md](../../AGENTS.md) - Development guidelines (British English, coding standards)
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) - PR review guidelines
