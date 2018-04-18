# Prismic Remapper

To remap content, export the documents from Prismic, dump it into `./.dist`.

Create the filter and remapper that you'd like, create a new folder for it, and
stick the remapper at `./<ACTION>/remap.js`.

Remappers should export a `map` and `filter` function, both of which take a
`{filename: string, doc: PrismicDocument}` object.

The new documents will be stored in `.dist/remapped`.

  yarn remap <FILTER_AND_MAPPER_NAME>

---

An example process of this could be

* Add new fields
* Write content mappers
* Write parsers for new fields
* PR
* Remap content to new fields and import into Prismic
* Remove old fields
* PR

---

# TODO
* Batch sizing (we don't have enough content for this to be an issue).
