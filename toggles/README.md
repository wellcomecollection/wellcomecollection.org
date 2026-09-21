# Toggles

We use toggles across our services to be able to release features to
different cohorts of people and stakeholders safely and incrementally.

"Toggles" is the umbrella term for all the different categories below.

There is [a great article by Martin Fowler][martin-fowler-feature-toggles] on the subject.

## Categories
We currently use four categories of toggles:

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

### 2. Phased flags

Phased flags are for a feature that's genuinely shipping in stages, rather than as a single on/off release. Instead of a `defaultValue`, a phased flag has an ordered list of `phases` (e.g. MVP, Phase 2, Phase 3). Selecting a phase always shows that phase's work plus everything from the phases before it — there's no way to show a later phase while hiding an earlier one.

Use a phased flag instead of two (or more) feature flags combined by hand in code. For example, `archiveCollection` and `archiveShortDescriptions` are two separate feature flags today, and the code that reads them combines the two with an explicit `&&` because one is meant to only ever be on together with the other. A phased flag replaces that pair with a single ordered dial: MVP (`archiveCollection`'s current behaviour) then Phase 2 (adds what `archiveShortDescriptions` adds).

Each phase can carry its own short (~20 word) `description` of what that specific phase adds, shown in the dashboard for whichever phase is currently selected. Anything longer belongs in the flag's `documentationLink`, same as for feature flags.

A phased flag is never authored already partway through its own phases — every phased flag starts with nothing public at all, the same starting point a feature flag gets from `initialValue: false`. That's why `defaultPhase` (what's actually public) only exists on the *published* shape (`PublishedPhasedFlag` in `toggles/webapp/index.ts`), not on the authored `PhasedFlagDefinition` in `toggles.ts` — there's nothing to set until a phase actually ships.

To add a new phased flag:
* Go to `toggles/webapp/toggles.ts`.
* Add a new entry to the `phasedFlags` array, with an ordered `phases` list.
* Iterate! Preview a phase by overriding it via the dashboard cookie, same as a feature flag.
* Once a phase has been public for a while and nothing's gone wrong, delete the code that checks for it — that part of the feature is now permanent — and remove that phase from the list.
* Once every phase has shipped this way, remove the phased flag from the code entirely.

**Not yet built:** `yarn deploy` doesn't publish `phasedFlags` to the toggles dashboard/JSON yet (see `toggles/webapp/deploy.ts`), so a phased flag added to `toggles.ts` currently only exercises the resolution logic in tests — it won't resolve anywhere in a running app until that's built.

### 3. Modes

Modes are like a feature flag, but instead of picking on/off, you pick one option from a fixed list — e.g. which kiosk device this browser represents (`kioskMode`), or which catalogue pipeline to query (`cataloguePipeline`). Unlike a phased flag, a mode's options aren't ordered: picking one option tells you nothing about the others, they're just different configurations a browser can be in, not stages of one thing.

Modes have no `defaultValue` — with no cookie set, a mode is simply inactive (`null`).

To add a new mode:
* Go to `toggles/webapp/toggles.ts`.
* Add a new entry to the `modes` array with its `options`.
* Log in to AWS and run `yarn deploy`. This will make it available on the [toggles dashboard](https://dash.wellcomecollection.org/toggles/).

### 4. A/B tests

This is to serve different content to different cohorts of people randomly based on a toggle.
A/B tests don't have a `defaultValue` — values are randomly assigned to users.

The implementation for A/B testing is contained within the [cache directory of this repo](../cache).
You can read more about it there.

We replicate the tests in [the Lambda@Edge](../cache/edge_lambdas/src/toggler.ts) here to allow
people to explicitly set which cohort they would like to be in.

## Accessing toggles in code

Client-side, use the following hooks:
- `useFeatureFlags()` — returns feature flag values
- `usePhasedFlags()` — returns each phased flag's current phase, bundled with its ordered phase list
- `useModes()` — returns mode values (the selected option id, or `null` if inactive)
- `useABTest()` — returns A/B test values

Combine `usePhasedFlags()` with `phaseIsAtLeast()` (from `@weco/toggles`) rather than comparing the phase id directly, since a later phase should always satisfy an earlier check:

```typescript
const { archiveCollection } = usePhasedFlags();
if (phaseIsAtLeast(archiveCollection, 'phase2')) {
  // Phase 2 (and everything from MVP) is showing
}
```

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

**Note for local development:** server-side toggle resolution
(`common/server-data/toggles.ts`) validates toggle cookies against the deployed
[toggles JSON](https://toggles.wellcomecollection.org/toggles.json), even when the
webapp is running locally. A toggle that only exists in `toggles/webapp/toggles.ts`
will not resolve from its cookie until the toggles package has been deployed with
`yarn deploy`.


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

