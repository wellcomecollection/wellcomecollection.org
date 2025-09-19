# Toggles

We use toggles across our services to be able to release features to
different cohorts of people and stakeholders safely and incrementally.

There is [a great article by Martin Fowler][martin-fowler-feature-toggles] on the subject.

## Categories
We currently use three categories of toggles:

### 1. Feature development toggle

Used to release a feature early, generally internally. We then develop the feature until
we are happy for it to be released to the public.

* Go to `toggles/webapp/toggles.ts`.
* Create new toggle with `initialValue: false`.
* log in to AWS and run `yarn deploy`. This will make it available on the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).
* If required, create a PR. Ensure you merge your code in `main`.
* Let internal users know they can turn this feature on via the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).
* Iterate!
* Once you're happy with releasing the feature publicly, run `yarn setDefaultValueFor --{toggle_id}=true`.
* If anything goes wrong, you can run `yarn setDefaultValueFor --{toggle_id}=false`.
* Once you're completely happy with it, remove the toggle from the code.

### 2. Feature toggle

Used to make certain permanent features available to people, but are generally turned off
for the public.

e.g. An API toolbar adding more context to works for internal users.

### 3. A/B tests

This is to serve different content to different cohorts of people randomly based on a toggle.

The implementation for A/B testing is contained within the [cache directory of this repo](../cache).
You can read more about it there.

We replicate the tests in [the Lambda@Edge](../cache/edge_lambdas/src/toggler.ts) here to allow
people to explicitly set which cohort they would like to be in.


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

