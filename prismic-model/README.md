# Content model for Prismic

All models are stored in Prismic as [custom types][custom-types].

We use [Slice Machine](https://prismic.io/slice-machine) to deploy types into Prismic.

As these deploys could potentially take the website down, we deploy locally and not through CI.

We can test changes to Prismic types in our [staging environment](https://prismic.io/docs/environments) and view the changes by switching on the relevant toggle on [our toggle dashboard](https://dash.wellcomecollection.org/toggles/index.html)

**Actions**

- [Fetching content type information](#fetching-content-type-information)
- [Updating an existing custom type](#updating-an-existing-custom-type)
- [Adding or deleting a custom type](#adding-or-deleting-a-custom-type)
- [Finding where slices are used](#finding-where-slices-are-used)
- [Analysing our Prismic content in bulk](#analysing-our-prismic-content-in-bulk)
- [Fetching Prismic assets metadata](#fetching-prismic-assets-metadata)

## Fetching content type information

It might be useful to find out more about a content/custom type, like how often it is used and what kind of content it has. You can run:

`yarn contentAnalysis`

to get a very basic report listing how often each type is used. You might want to add flags for more information, though:

`--type [content type name]` will print out more information about a specific type. There might be a lot of them and it can't print them all, so...
`--report` will create a `contentReport.json` file with the full list.
`--printUrl` will also try to give you relevant URLs based on the type and ID.

---

## Updating an existing custom type

We make changes to our prismic models, and deploy them, using slice machine.

Run slice machine with the following command `yarn slicemachine` in the root of the project and access it at localhost:9999

When deploying changes, slicemachine will only tell you which files have changed but not what those changes are. If you want more detail you can run `yarn diffCustomTypes` from inside the /prismic-model.

**WARNING:**
If you are **removing fields from a custom type**, if those are referenced in a query, you must remove any reference to those fields from the content app queries and **deploy the changes to the content app first**, before deploying the changes to Prismic.

1. Make PR (`A`) that only removes fields from queries
2. Prepare a second PR (`B`) that removes slices/fields completely
3. Get both `A` and `B` approved before moving on.
4. Merge and deploy `A` all the way to prod
5. Whilst running `B` locally, run `yarn deployType` command lines
6. Publish something in Prismic to ensure it uses the new types
7. Merge and deploy `B` all the way to Prod

If you are **adding fields to a custom type** and it needs to be specifically referenced in a query, you must **deploy the changes to Prismic first**, before deploying queries to those fields in the content app.

1. Make PR (`A`) that adds slices to the system
2. Whilst running `A` locally, run `yarn deployType` command lines
3. Publish something in Prismic to ensure it uses the new types
4. Merge and deploy `A` all the way to prod
5. Make a second PR (`B`) that adds what you need to queries
6. Merge and deploy `B` all the way to Prod

[custom-types]: https://prismic.io/docs/core-concepts/custom-types
[custom-types-api]: https://prismic.io/docs/technologies/custom-types-api

**To see any model changes in the API:**
Reading between the lines in the [Prismic docs](https://prismic.io/docs/core-concepts/content-modeling-with-json#recover-lost-data) and an old [Prismic support thread](https://community.prismic.io/t/deleted-field-in-custom-type-still-shows-up-in-api-response/3459/6), coupled with the timing of content being published and seeing changes in the API. It looks like the **model updates are only reflected in the API response once a piece of content has been published**. You should do this whenever you change the model and check the prismic API response for the change to verify everything is working as expected.

**Rolling back:**
If a model change has caused the site to error. The quickest fix is to revert the model change and publish a piece of content in Prismic, so the model change is reflected in the Prismic response.

---

## Adding or deleting a custom type

Adding/deleting/modifying custom types and slices is done in the slicemachine interface.

Run slice machine with the following command `yarn slicemachine` in the route of the project and access it at localhost:9999

---

## Finding where slices are used

The body of a Prismic document is made of "slices" (e.g. quote, paragraph, image).

We have a tool that shows you examples of where a slice is used.
This is useful if you want to know if a slice can be safely deleted from the model, or to find an example for testing.
You can run:

`yarn sliceAnalysis`

You might want to add flags for more information, though, such as:

`--type [slice type name]` will print out more information about a specific type. There might be a lot of them and it can't print them all, so...
`--report` will create a `sliceReport.json` file with the full list.

See the file comment on [sliceAnalysis.ts](./sliceAnalysis.ts)

---

## Analysing our Prismic content in bulk

We have a tool that will download a complete snapshot of our Prismic metadata for you.
This is useful if you want to do bulk analysis of our Prismic data.

```console
$ yarn downloadSnapshot
...
Downloaded Prismic snapshot to snapshot.master.Yhe_-xMAADOEgW3d
```

One especially common case is checking that we haven't broken any Prismic content after a refactor.
If you have a locally running content app (`yarn content` in the repo root), you can check that none of our Prismic content is broken:

```console
$ yarn tryAllContentPages
```

## Migrating content using the migration API

The [migration API](https://prismic.io/docs/migration-api-technical-reference) allows you to `PUT` changes to existing Prismic documents, or `POST` new documents. The data format follows the response format of the [document API](https://prismic.io/docs/rest-api-technical-reference).

The `migrate.ts` script expects an `--type` parameter for a custom type, and will migrate all documents of this type as you please (e.g. to mutate the shape of the body slices in order to work with Slice Machine).

You will need to create a `.env` file with values for the variables listed in `.env_example` if one doesn't exist.

### Usage

```console
$ yarn migrate --type articles
```

### Note

This will only migrate _published_ documents. In order to migrate documents in draft, you will first have to find the Prismic `ref` of the document and include this as an option to `createClient`. Once a draft document is in a migration release, it is important _not_ to publish it, otherwise it will indeed be published on the front-end. Instead, it should be archived and then re-saved to draft from the archive. In order to test that the migration will do what you expect, strongly consider running it against the Prismic stage environment and deploying the migration release from there first.

Finding a `ref` is not straightforward. One method is to preview a draft document and inspect the network tab in dev tools filtered to Fetch/XHR to find a request called `predict`. This contains the `ref` as a query param.

---

## Fetching Prismic assets metadata

We have a tool that fetches metadata for all assets (images, documents, videos, etc.) from the Prismic Asset API.

```console
$ yarn fetchPrismicAssets
```

This will fetch all asset metadata from Prismic and save it to a timestamped file: `prismic-assets-{timestamp}.json` containing the full assets array.

### Asset metadata structure

Each asset includes fields like:

- `id`, `url`, `filename`, `size`
- `kind` (image, document, video, audio)
- `width`, `height` (for images)
- `last_modified`, `created_at` timestamps
- `alt`, `credits`, `notes`
- `tags`, `ai_metadata`

### Authentication

You will need to create a `.env` file with `PRISMIC_BEARER_TOKEN_STAGE`.
