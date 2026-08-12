# Generated catalogue API types

`catalogue-api.d.ts` is generated from the catalogue API's OpenAPI spec
(`reference/catalogue.yaml` in
[wellcomecollection/catalogue-api](https://github.com/wellcomecollection/catalogue-api))
by `yarn generate:catalogue-types`, which reads the spec from that repo's `main`
branch.

Do not edit it by hand. When the spec changes, catalogue-api sends this repo a
`repository_dispatch` event and `.github/workflows/sync-catalogue-types.yml`
regenerates the file, opening an auto-PR here if it changed, the same pattern as
`sync-prismic-types.yml` pushing Prismic types into content-api. Any local edit
would be overwritten by the next sync.

The intent is for the hand-written catalogue types in the parent directory to
progressively extend, or be checked against, these generated base types, so the
API contract has one source of truth. See `../schema-compatibility.ts` for first
examples of relating the hand-written `Work` and `Image` types to the schema.
