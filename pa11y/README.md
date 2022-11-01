# pa11y

pa11y is [an open-source tool][pa11y] for automated accessibility testing.
We use it to detect accessibility issues on wellcomecollection.org.

[pa11y]: https://pa11y.org/

## Getting pa11y results

You can get a new set of pa11y results by running:

```console
$ cd webapp
$ yarn write-report
$ AWS_PROFILE=experience-dev yarn deploy
```

Alternatively, we re-run pa11y on every deployment to prod.

The results are shown in a dashboard at <https://dash.wellcomecollection.org/pa11y>

## Testing new pages

To test a new page with pa11y, add to the list of URLs in `write-report.js`.
