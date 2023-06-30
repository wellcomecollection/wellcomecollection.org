# Content model for Prismic

All models are created in TypeScript, and stored in Prismic as [custom types][custom-types].

We use the [Custom types API][custom-types-api] to deploy types into Prismic.

As these deploys could potentially take the website down, we deploy locally and not through CI.

**Actions**
- [Fetching content type information](#fetching-content-type-information)
- [Updating an existing custom type](#updating-an-existing-custom-type)
- [Adding or deleting a custom type](#adding-or-deleting-a-custom-type)
- [Finding where slices are used](#finding-where-slices-are-used)
- [Analysing our Prismic content in bulk](#analysing-our-prismic-content-in-bulk)


## Fetching content type information
It might be useful to find out more about a content/custom type, like how often it is used and what kind of content it has. You can run:

`yarn contentAnalysis`

to get a very basic report listing how often each type is used. You might want to add flags for more information.

`--type [content type name]` will print out more information about a specific type. There might be a lot of them and it can't print them all, so...
`--report` will create a `contentReport.json` file with the full list.
`--printUrl` will also try to give you relevant URLs based on the type and ID.


----


## Updating an existing custom type
To deploy a type:

    yarn deployType --id {custom_type_id}

You'll then be given a diff to validate, and deploy. We have no test environment for Prismic.

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

If you change [a part](./src/parts) included in multiple types, e.g. [`body`](./src/parts/body.ts),
you will have to remember to deploy all affected types.

[custom-types]: https://prismic.io/docs/core-concepts/custom-types
[custom-types-api]: https://prismic.io/docs/technologies/custom-types-api

**To see any model changes in the API:**
Reading between the lines in the [Prismic docs](https://prismic.io/docs/core-concepts/content-modeling-with-json#recover-lost-data) and an old [Prismic support thread](https://community.prismic.io/t/deleted-field-in-custom-type-still-shows-up-in-api-response/3459/6), coupled with the timing of content being published and seeing changes in the API. It looks like the **model updates are only reflected in the API response once a piece of content has been published**. You should do this whenever you change the model and check the prismic API response for the change to verify everything is working as expected.

**Rolling back:**
If a model change has caused the site to error. The quickest fix is to revert the model change and publish a piece of content in Prismic, so the model change is reflected in the Prismic response.


----


## Adding or deleting a custom type
### Adding a new custom type
To first create a new type, go through the [Custom Type UI](https://wellcomecollection.prismic.io/masks/). Ensure the API ID follows our kebab-case naming convention.

As for the rest, we need to have the custom type definition in our codebase in order to use `deployType` efficiently in the future.

In the `./src/` folder, create a new file (`[api-id].ts`). If you want a custom body, this gets created in `./src/parts/`. You may look at other types in those folders for inspiration of refer to the [Custom types API][custom-types-api] documentation.

You can then use `yarn deployType --id [your-type]` to update the model.

### Deleting a custom type
Go through the [Custom Type UI](https://wellcomecollection.prismic.io/masks/) for this, you'll have to first disable it, which won't delete the instances, only remove it as an active option. Then, _if there are no instances of it anymore_, you can then delete it from the "Disabled" section.

Ensure you remove references to the type in the codebase for maintenance purposes.


----


## Finding where slices are used

The body of a Prismic document is made of "slices" (e.g. quote, paragraph, image).

We have a tool that shows you examples of where a slice is used.
This is useful if you want to know if a slice can be safely deleted from the model, or to find an example for testing.

For example:

```console
$ ts-node sliceAnalysis --type embed
```

See the file comment on [sliceAnalysis.ts](./sliceAnalysis.ts)


----


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
