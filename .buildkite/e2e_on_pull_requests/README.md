# end-to-end tests on pull requests

The Buildkite scripts/config in this folder allow us to run end-to-end (e2e) tests on pull requests.
It's moderately fiddly, so this README tries to outline the broad approach.

## Desirable properties

*   We should be able to run our full suite of end-to-end tests on pull requests before we merge to `main`.
*   These tests should run in an environment that's as similar as possible to our "real" environment -- i.e., prod.
*   These tests should be opt-in -- somebody who's making a docs or test-only change shouldn't need to wait for a complete e2e suite that we already know will pass.

## What it looks like for devs

At the end of a "build + test" job, devs get asked whether they want to run end-to-end tests:

<img src="e2e_dev_picker.png">

If you select **Yes, run e2e tests now**, Buildkite will start running the end-to-end tests as part of the same "build + test" job.

If you select **Not now, maybe later**, Buildkite will complete the current build, but ask you again when you push new commits.
This is useful if you know your PR is a draft or work-in-progress, and it's not worth running e2e tests yet.

If you select **No, not needed for this PR**, Buildkite will complete the current build, and won't ask you again when you push new commits.
Instead, it adds the `e2es not required` label to your PR.
If you want to re-run e2es later, remove this label.

## How it works

This is the rough flow:

```mermaid
flowchart TD
    B["Buildkite runs tests on PR<br>(see pipeline.yml)"]
    B --> HL{is there a<br>'skip e2e tests'<br>label?}
    HL -->|yes| X[nothing to do,<br/>build completes]
    HL -->|no| ASK{ask the user<br/>if they want<br/>to run e2es<br/>on this PR}

    ASK -->|yes, now| Y["run e2e tests"]
    ASK -->|no, maybe later| ML[nothing to do,<br/>build completes]
    ASK -->|no, not needed| N[add the 'skip e2e tests' label<br/>in GitHub, build completes]
```

At both the choice steps, we're using `buildkite-agent pipeline upload` to dynamically add more steps to the pipeline.
See the individual scripts/YAML files for more explanatory comments.
