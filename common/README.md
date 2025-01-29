# @weco/common

This contains some code which is shared among the front-end apps.

Of particular interest:

* The `data` directory holds most the hard-coded data for the site (e.g. microcopy, error messages, contact information). We keep it in one place so it can be easily reviewed and updated across the site.
* The `customtypes` and `views/slices` directories contain the Prismic model data which is created locally using (SliceMachine)[https://prismic.io/slice-machine]. When creating new custom types, slices, or fields, refer to the (API ID name casing docs in Gitbook)[https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/451yLOIRTl5YiAJ88yIL/api-id-name-casing]


## Bundle analysis
Previously stored in S3 and displayed on dash.wellcomecollection.org, you can still run it locally.
It currently only is set-up for `content/`, as it's using the `next/next.config.js`. Other repos could be made to use it.
Example of how to use:
1. `cd content/webapp`
2. `BUNDLE_ANALYZE=true yarn build`
3. It'll render new files, you're probably interested in the one at: `/content/webapp/.dist/content.client.test.html`.