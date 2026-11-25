# @weco/common

This contains some code which is shared among the front-end apps.

Of particular interest:

* The `data` directory holds most the hard-coded data for the site (e.g. microcopy, error messages, contact information). We keep it in one place so it can be easily reviewed and updated across the site.
* The `customtypes` and `views/slices` directories contain the Prismic model data which is created locally using (SliceMachine)[https://prismic.io/slice-machine]. When creating new custom types, slices, or fields, refer to the (API ID name casing docs in Gitbook)[https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/451yLOIRTl5YiAJ88yIL/api-id-name-casing]