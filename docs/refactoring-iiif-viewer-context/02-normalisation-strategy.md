# Normalisation Strategy

[← Back to Index](./README.md)

**Key principle:** When centralising duplicated logic, we normalise to a single canonical implementation even when variants differ slightly.

## Why Normalise Variations?

The duplicated calculations aren't always exactly identical - they have minor variations in:
- Access patterns (`canvas` destructured vs `query.canvas` direct access - same value, different syntax)
- Optional chaining depth (`canvases?.[...]` vs `transformedManifest?.canvases[...]`)
- Fallback values (some have `|| ''`, others allow undefined - need to determine which is correct)

We still centralise these because:
1. They compute the same logical value - just with different syntax
2. Normalisation prevents drift - variations can grow into bugs over time
3. Reduces cognitive load - one canonical way to access the value
4. Makes changes easier - update once, not in 4 places

## Choosing the Canonical Implementation

For each duplicated value, we choose the most defensive/complete version:

| Value | Current Variations | Canonical Version | Rationale |
|-------|-------------------|-------------------|-----------|
| `currentCanvas` | `canvases?.[i]` vs `transformedManifest?.canvases[i]` (accessing same data via different paths) | Use `transformedManifest?.canvases[i]` | More explicit about data source |
| `mainImageService` | With/without `\|\| ''` fallback | Include `\|\| ''` only if downstream code requires it | `ZoomedImage` has fallback because `convertRequestUriToInfoUri` expects string. `IIIFViewer` doesn't need it. **Check actual usage before adding fallback.** |
| `hasMultipleCanvases` | Not in context | Add to context | Calculated in `IIIFViewer`, used in multiple components |

## Normalisation Testing Requirements

For each normalised value, verify that:
1. Original behaviour preserved - components work identically with context version
2. Edge cases handled - undefined/null cases don't break
3. Type safety maintained - TypeScript types are correct
4. Fallback behaviour tested - **verify fallbacks are only added where genuinely needed**

---

**Next:** [03 - Naming Conventions](./03-naming-conventions.md)
