# Content model for Prismic

All models are created in TypeScript, and stored in Prismic as [custom types][custom-types].

We use the [Custom types API][custom-types-api] to deploy types into Prismic.

As these deploys could potentially take the website down, we deploy locally and not through CI.

To deploy a type:

    yarn deployType --id {custom_type_id}

You'll then be given a diff to validate, and deploy. We have no test environment for Prismic.

**WARNING:**
If you are **removing fields from a custom type**, you must remove any queries for those fields from the content app and **deploy the changes to the content app first**, before deploying the changes to Prismic.

If you are **adding fields to a custom type**, you must **deploy the changes to Prismic first**, before deploying queries to those fields in the content app.

If you change [a part](./src/parts) included in multiple types, e.g. [`body`](./src/parts/body.ts),
you will have to remember to deploy all affected types.

[custom-types]: https://prismic.io/docs/core-concepts/custom-types
[custom-types-api]: https://prismic.io/docs/technologies/custom-types-api

## Find where slices are used

The body of a Prismic document is made of "slices" (e.g. quote, paragraph, image).

We have a tool that shows you examples of where a slice is used.
This is useful if you want to know if a slice can be safely deleted from the model, or to find an example for testing.

For example:

```console
$ ts-node sliceAnalysis --type embed
```

See the file comment on [sliceAnalysis.ts](./sliceAnalysis.ts)
