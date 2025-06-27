# updown

This has the configuration for our checks in Updown.io, which we use to monitor the site.
We get alerts of outages by Slack and email.

You can see our Updown status page at <https://updown.io/p/1bj95>

Our checks are configured using custom scripts to ensure consistency, with [the Updown API][api] and an API key kept in Secrets Manager.
That allows any developer to configure our Updown checks, even if they don't have our Updown password.

[api]: https://updown.io/api

## To deploy new checks

Our checks are configured in `updown-checks.ts`.
Update this file, then either merge a PR or deploy manually with:

```console
$ AWS_PROFILE=platform-developer yarn apply
```

This will deploy your new checks to Updown.
