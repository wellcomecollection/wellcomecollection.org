# pa11y

pa11y is [an open-source tool][pa11y] for automated accessibility testing.
We use it to detect accessibility issues on wellcomecollection.org.

We run it with [axe][axe] rather than pa11y's default runner (HTML_CodeSniffer), which misreads text over absolutely positioned backgrounds and doesn't check ARIA values. Each page is loaded with the cookie consent already set, so the cookie banner doesn't get in the way of the contrast checks. Anything axe can't decide (e.g. text on a background image) is reported as a warning rather than an error, so it shows up for checking by hand without failing the run. A few of axe's best-practice rules (`region`, `heading-order`, `landmark-unique`) are switched off, as they're not WCAG requirements and would bury those warnings.

Pull request runs list errors in full, but summarise warnings: one line per rule and component (the nearest `data-component`, or the element's tag outside one), with a count and the pages it's on. Pass `--allWarnings` to list each warning.

[pa11y]: https://pa11y.org/
[axe]: https://github.com/dequelabs/axe-core

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
