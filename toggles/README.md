# Toggles

We use toggles across our services to be able to release features to
different cohorts of people and stakeholders safely and incrementally.

"Toggles" is the umbrella term for all the different categories below.

There is [a great article by Martin Fowler][martin-fowler-feature-toggles] on the subject.

## Categories
We currently use two categories of toggles:

### 1. Feature flags

Feature flags control the visibility of features. They have a `defaultValue` (true/false)
that determines whether the feature is on or off for the public.

Types of feature flag:
- **Experimental** — used to release a feature early, generally internally, while it's being developed.
- **Permanent** — used to make certain features available to people, but generally turned off for the public (e.g. an API toolbar).
- **Stage** — only applied on the staging environment.

To add a new feature flag:
* Go to `toggles/webapp/toggles.ts`.
* Add a new entry to the `featureFlags` array with `initialValue: false`.
* Log in to AWS and run `yarn deploy`. This will make it available on the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).
* If required, create a PR. Ensure you merge your code in `main`.
* Let internal users know they can turn this feature on via the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).
* Iterate!
* Once you're happy with releasing the feature publicly, run `yarn setDefaultValueFor --{toggle_id}=true`.
* If anything goes wrong, you can run `yarn setDefaultValueFor --{toggle_id}=false`.
* Once you're completely happy with it, remove the toggle from the code.

### 2. A/B tests

This is to serve different content to different cohorts of people randomly based on a toggle.
A/B tests don't have a `defaultValue` — values are randomly assigned to users.

The implementation for A/B testing is contained within the [cache directory of this repo](../cache).
You can read more about it there.

We replicate the tests in [the Lambda@Edge](../cache/edge_lambdas/src/toggler.ts) here to allow
people to explicitly set which cohort they would like to be in.

## Accessing toggles in code

Client-side, use the following hooks:
- `useFeatureFlags()` — returns feature flag values
- `useABTest()` — returns A/B test values

These are exported from `@weco/common/server-data/Context`.

Server-side, the toggles JSON is fetched from S3 and merged with the user's cookies
automatically as part of the server data pipeline. In `getServerSideProps`, access
toggle values via `serverData.toggles`:

```typescript
if (serverData.toggles.someFeatureFlag.value) {
  // feature is enabled
}
```

The `serverData.toggles` object is also passed to services that need it
(e.g. catalogue API clients).


## Deployment

The toggles are compiled from [TypeScript](./webapp/toggles.ts) to JSON, stored in an [S3 bucket](./terraform/main.tf)
and served via the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).

Deployment happens in the [webapp directory](./webapp)

To deploy your toggles:

```
yarn deploy
```

This will add, remove or update all toggle properties, but leave their `defaultValues` untouched. This
is to ensure if you have turned off a toggle in an emergency, when a deploy happens, it is not overridden.

You can change a toggle's `defaultValue` via:

```
yarn setDefaultValueFor --{toggle_id}=true
```

## Preset links
Query params were added to allow automatic turning on/off of toggles (e.g. when sharing with other teams). The format is as follow:
- Enable: `https://dash.wellcomecollection.org/toggles/?enableToggle={toggle_id}`
- Disable: `https://dash.wellcomecollection.org/toggles/?disableToggle={toggle_id}`
- Reset all: `https://dash.wellcomecollection.org/toggles/?resetToggles`


## Useful links
- ["Feature Toggles (aka Feature Flags)" - by Martin Fowler][martin-fowler-feature-toggles]
- [Toggles Dashboard](https://dash.wellcomecollection.org/toggles)
- [Toggles JSON](https://toggles.wellcomecollection.org/toggles.json)

[martin-fowler-feature-toggles]: https://martinfowler.com/articles/feature-toggles.html

