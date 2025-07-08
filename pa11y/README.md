# pa11y

pa11y is [an open-source tool][pa11y] for automated accessibility testing.
We use it to detect accessibility issues on wellcomecollection.org.

[pa11y]: https://pa11y.org/

## Getting pa11y results

You can get a new set of pa11y results by running:

```console
$ cd webapp
$ AWS_PROFILE=experience-developer yarn report-and-deploy
```

Alternatively, we re-run pa11y on every deployment to prod.

The results are shown in a dashboard at <https://dash.wellcomecollection.org/pa11y>

## How we choose what pages to test

We have to specify a list of URLs for pa11y to check – it doesn't crawl the site looking for content.

We want it to test a representative sample – any time you create a new page type, add an example to pa11y.

To add a new URL, add to the list in `report-and-deploy.js`.
