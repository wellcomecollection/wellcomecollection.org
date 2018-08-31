# Prismic Remapper

To remap content, export the documents from Prismic, dump it into `./.dist`.

Create the filter and remapper that you'd like, create a new folder for it, and
stick the remapper at `./<ACTION>/remap.js`.

Remappers should export a `filter` and `map` function, both of which take a
`{filename: string, doc: PrismicDocument}` object.

The new documents will be stored in `.dist/remapped`.

  yarn remap <FILTER_AND_MAPPER_NAME> <--log-ids>


## It all broke - get me out of here ＼(º □ º l|l)/
The premapped content get's saved into the remapper folder, under `premapped`.
Just zip that up and upload it to Prismic.

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
* Think about version control of content to avoid not being able to roll back.
