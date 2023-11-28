# updown

This has the configuration for our checks in Updown.io, which we use to monitor the site.
We get alerts of outages by Slack and email.

You can see our Updown status page at <https://updown.io/p/1bj95>

Our checks are configured using custom scripts to ensure consistency, with [the Updown API][api] and an API key kept in Secrets Manager.
That allows any developer to configure our Updown checks, even if they don't have our Updown password.

[api]: https://updown.io/api

## To deploy new checks

Our checks are configured in `expected-checks.ts`.
Update this file, then run:

```console
$ AWS_PROFILE=platform-dev AWS_SDK_LOAD_CONFIG=1 yarn checks
```

This will deploy your new checks to Updown.
