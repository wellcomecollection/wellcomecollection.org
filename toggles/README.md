# Toggles

We use toggles across our services to be able to release features to
different cohorts of people and stakeholders safely and incrementally.

There is [a great article by Martin Fowler][martin-fowler-feature-toggles] on the subject.

We currently use three categorisations of toggles:

## Feature development toggle

Used to release a feature early, generally internally. We then devvelop the feature until
we are happy for it to be released to the public. These should expire over time.

* create new toggle with `defaultValue: false`
* let internal users know they can turn this feature on via the [toggles dashboard][toggles-dashboard]
* iterate!
* set `defaultValue: true` once you're happy with releasing the feature publically
* if anything goes wrong, you can run `yarn setDefaultValueFor --{toggle_id}=false`
* once you're happy, remove the toggle from the code

## Feature toggle

Used to make certain permanent features available to people, but are generally turned off
for the public.

e.g. An API toolbar adding more context to works for internal users.

## A/B tests

This is to serve different content to different cohorts of people randomly based on a toggle.

The implmenetation for A/B testing is contained within the [cache directory of this repo](../cache).
You can read more about it there.

We replicate the tests in [the lambda@dege](../cache/edge_lambdas/src/toggler.ts) here to allow
people to explicitly set which cohort they would like to be in.


## Deployment

The toggles are compiled from [TypeScript](./webapp/toggles.ts) to JSON, stored in an [S3 bucket](./terraform/main.tf)
and served [via HTTP][toggles].

Deployment happens in the [webapp directory](./webapp)

To deploy your toggles:

  yarn deploy

This will add, remove or update all toggle properties, but leave their `defaultValues` untouched. This
is to ensure if you have turned off a toggle in an emergency, when a deploy happens, it is not overridden.

You can change a toggle's `defaultValue` via:
  
  yarn setDefaultValueFor --{toggle_id}=true`

[martin-fowler-feature-toggles]: https://martinfowler.com/articles/feature-toggles.html
[toggles-dashboard]: https://dash.wellcomecollection.org/toggles/
[toggles]: https://toggles.wellcomecollection.org/toggles.json

