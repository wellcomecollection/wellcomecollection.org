## GitHub Action: Lighthouse report table

This is an Action which takes a [manifest](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#outputdir) from https://github.com/treosh/lighthouse-ci-action and outputs a markdown-formatted table.

This has the built source (in `dist`) checked into the repo - this is [standard practice](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github)(!) for GitHub Actions, so remember to run `yarn build` after any changes.
