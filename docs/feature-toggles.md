# Feature toggles
We use feature toggles to develop and release features and code early.

We have different release strategies dependant on what phase a feature is in,
or what we are trying to achieve.

We use the open source [Unleash](https://github.com/Unleash/unleash) to manage
our flags.


## Toggling the toggles
Some use cases might be:

### User specific, non public use
Behind a [`UserEnabled`](./common/services/unleash/feature-toggles.js#L15)
toggle. You can enable these toggles via the URL
i.e. `/works?toggles=toggle1:true,toggle2:false`. These are good for features
that aren't fully developed but we would like to keep the PR size down and share
across the team before releasing publicly.

### Cohorts
If a user is in a cohort, use
[`ActiveForUserInCohort`](./common/services/unleash/feature-toggles.js#L15).

A user can join a cohort by sharing the URL `/?cohort=cohortName`.

### Gradual release
TBD


## Creating toggles
TBD
