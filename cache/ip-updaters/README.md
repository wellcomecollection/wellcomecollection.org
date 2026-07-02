# WAF IP Set Updaters

Automated Lambda functions that keep WAF IP allowlists up to date. Both follow the same pattern: fetch the latest IP ranges, validate the change magnitude (default 10%), and update the WAF IP set.

| Lambda | IP set | Source | Schedule |
|---|---|---|---|
| `google-bot-ip-updater` | `google-bots` | [common-crawlers.json](https://developers.google.com/static/crawling/ipranges/common-crawlers.json) | Daily 2 AM UTC |
| `github-actions-ip-updater` | `github-actions` | [api.github.com/meta](https://api.github.com/meta) | Daily 3 AM UTC |

Both send failure alerts via SNS.

## Files

- [`google-bots.js`](./google-bots.js) — fetches Google bot IPv4 ranges (common-crawlers only; special-crawlers excluded as they don't send a Googlebot user-agent)
- [`github-actions.js`](./github-actions.js) — fetches GitHub Actions runner IPv4 ranges
- [`waf-updater.js`](./waf-updater.js) — shared engine: change validation, WAF get/update, IP extraction, logging
- `waf-updater.test.js` — tests for the shared engine (`yarn test` to run)
- [`package.json`](./package.json) — local dev dependencies (`yarn install` before running locally)

Terraform: [`ip_updater_google_bots.tf`](../ip_updater_google_bots.tf), [`ip_updater_github_actions.tf`](../ip_updater_github_actions.tf)

## Manual run (local)

You need `@aws-sdk/client-wafv2` available. Run from inside this directory:

```bash
yarn install
```

Then, for either updater, first look up the IP set ID:

```bash
# Google bots
AWS_PROFILE=experience-developer aws wafv2 list-ip-sets --scope CLOUDFRONT --region us-east-1 \
  --query "IPSets[?Name=='google-bots'].Id" --output text

# GitHub Actions
AWS_PROFILE=experience-developer aws wafv2 list-ip-sets --scope CLOUDFRONT --region us-east-1 \
  --query "IPSets[?Name=='github-actions'].Id" --output text
```

Then run the handler with that ID:

```bash
# Google bots
AWS_PROFILE=experience-developer IP_SET_ID=<ip-set-id> \
  node -e "require('./google-bots').handler().then(console.log)"

# GitHub Actions
AWS_PROFILE=experience-developer IP_SET_ID=<ip-set-id> \
  node -e "require('./github-actions').handler().then(console.log)"
```

## Manual invocation (AWS Lambda)

```bash
# Google bots
AWS_PROFILE=experience-developer aws lambda invoke \
  --function-name google-bot-ip-updater \
  --region us-east-1 \
  --cli-binary-format raw-in-base64-out \
  --payload '{}' \
  /tmp/response.json \
  --log-type Tail \
  --query 'LogResult' \
  --output text | base64 -d

# GitHub Actions
AWS_PROFILE=experience-developer aws lambda invoke \
  --function-name github-actions-ip-updater \
  --region us-east-1 \
  --cli-binary-format raw-in-base64-out \
  --payload '{}' \
  /tmp/response.json \
  --log-type Tail \
  --query 'LogResult' \
  --output text | base64 -d
```

**Logs:** `/aws/lambda/google-bot-ip-updater`, `/aws/lambda/github-actions-ip-updater`

## Troubleshooting: "IP content change of … exceeds maximum allowed"

This validation gate in `waf-updater.js` prevents accidental bulk updates. If the change is legitimate:

1. Verify the source data (check [api.github.com/meta](https://api.github.com/meta) or Google's API directly)
2. Temporarily increase `MAX_CHANGE_PERCENT` in [`waf-updater.js`](./waf-updater.js)
3. Run the handler locally or invoke the Lambda
4. Revert the `waf-updater.js` change before committing — do not merge a higher change gate to main
