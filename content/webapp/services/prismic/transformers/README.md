# Prismic transformers (content webapp)

This folder contains the app-specific transformers used by the Content webapp to turn Prismic API responses into our domain types (e.g. `Event`, `Page`, `Season`).

There are also shared, cross-app transformers in `common/services/prismic/transformers/` (e.g. image transforms). Prefer those when the logic is truly shared.

## What goes where

- **App/domain transformers** live here: `content/webapp/services/prismic/transformers/`
  - Example: turning a `RawEventsDocument` into an `Event`.
- **Shared low-level helpers** live in `common/services/prismic/transformers/`
  - Example: turning Prismic image fields into our `ImageType`.
- **Type guards / narrowing helpers** live in `common/services/prismic/types/`
  - Use these to narrow Prismic unions (links, relationships) safely.

## Best practices

### 1) Prefer explicit inputs: "document" vs "relationship"

Prismic has two common shapes you’ll transform:

- **Full document** (from a query): a `RawXDocument` with standard document fields and a complete `data` object.
- **Content relationship field** (a link to another document), which may include partial `data` (via `fetchLinks` / GraphQuery).

A relationship field is **not** a full `RawXDocument`, even if it has `data`. Avoid pretending it is by casting.

**Do:**
- Keep existing transformers that accept full documents: `transformX(document: RawXDocument)`.
- Add a relationship-shaped entry point when you’re transforming a relationship field: `transformXFromRelationship(field: unknown)`.

We have examples of this pattern:
- `transformSeasonFromRelationship` / `transformSeasonsFromRelationshipGroup`
- `transformPlaceFromRelationship` / `transformPlacesFromRelationshipGroup`
- `transformGenericFieldsFromRelationship`

These exist to avoid unsafe casts like `relationship as RawSeasonsDocument`.

### 2) Narrow Prismic unions using `prismic.isFilled.*` and our guards

Prismic link and relationship fields are unions (empty/filled/broken/etc.). Narrow them before accessing fields.

Prefer:
- `prismic.isFilled.link(field)`
- `prismic.isFilled.contentRelationship(field)`

And/or shared guards from `common/services/prismic/types/` (e.g. "filled document link with typed data").

### 3) Keep relationship transforms conservative

When transforming a relationship field:

- Only rely on fields that are expected to be present on relationship `data` (because it is usually populated by `fetchLinks`).
- Be defensive about optional fields (e.g. `uid` can be absent for some relationships; if your domain type requires it, return `undefined`).
- Filter out incomplete relationships before transforming: relationships from `fetchLinks` may lack nested fields required by document transformers (e.g. see exhibitions.ts exhibits filtering).

### 4) Avoid `any` / `unknown as RawXDocument` casts

If you find yourself writing `as unknown as RawXDocument`, it usually means you’re passing a relationship into a document transformer.

Prefer one of:
- Add a `transformXFromRelationship()` and call that instead.
- If you truly have a full document already, fix the type at the callsite so you can call `transformX(document)` without casting.

### 5) Keep `transformGenericFields*` usage aligned with input shape

- Use `transformGenericFields(document)` when you have a full `RawXDocument`.
- Use `transformGenericFieldsFromRelationship({ id, data })` when you have a relationship field that carries partial `data`.

## Testing

- If you add/modify a transformer, update/add tests in this folder where they already exist.
- If you change shared low-level behaviour (e.g. images/links), tests may live in `common/services/prismic/transformers/`.

## Quick checklist

Before merging transformer changes:

- Run `yarn -s tsc` (or `yarn tsc` if you want the full workspace run).
- Confirm relationship fields aren’t being cast to full documents.
- Confirm link/relationship narrowing uses `prismic.isFilled.*` or shared guards.
