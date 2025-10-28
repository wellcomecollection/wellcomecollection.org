# playwright

This directory contains our **end-to-end (E2E) tests**.
We have E2E tests for several reasons:

*   To make sure our site is as accessible as possible for our users
*   To make sure the main components of the site are working

Our E2E tests are based on [user stories](./user-stories).
Suggested reading: Dan North's blog post [What's in a story?](https://dannorth.net/whats-in-a-story/)

We write tests around [how our services are used](https://testing-library.com/docs/guiding-principles) over testing implementation.

We should consider the different ways in which our services can be accessed by using [selectors and drivers that the people using our site would use](https://playwright.dev/docs/selectors#best-practices).

## Running the tests

Our E2E tests are run automatically in CI:

*   after new code has been deployed to staging, before new code has been deployed to prod
*   after new code has been deployed to prod

This means they're one set of regression tests we use for the overall site to prevent bad deploys.

You can also run the tests locally.
First start the site by running, e.g. `yarn content` in the root of the repo.
Then:

```console
$ cd playwright
$ yarn
$ PLAYWRIGHT_BASE_URL=http://localhost:3000 yarn test
```

Some tests require you to run both `content` & `identity` apps at the same time, to do this run from the repository root:

```console
$ ./scripts/run-concurrently.sh
```

> [!IMPORTANT]
> Remember to update the [Dockerfile](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/playwright/Dockerfile#L1) to use the appropriate image when updating Playwright in package.json
