# Content webapp runbook

The content webapp renders wellcomecollection.org: the home page, what's on, exhibitions, events, stories, and works, images and concepts search.

- **Backplane:** [content](https://backplane.wellcome.digital/catalog/component/default/content) (internal). The owning team, its contact channel and any suppliers sharing the service are on that page. The website as a whole is the [wellcomecollection-org](https://backplane.wellcome.digital/catalog/system/default/wellcomecollection-org) System (internal).
- **Code:** [wellcomecollection.org/content](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/content)
- **Last reviewed:** 2026-11-13, first draft

## What it is

A Next.js app behind Koa, running as an ECS service in the experience AWS account. CloudFront serves all traffic to wellcomecollection.org, applies the WAF, caches pages and forwards everything except static assets to the app through a load balancer. The app fetches content from Prismic and catalogue data from the Catalogue, Content, Concepts and Items APIs. The account pages under `/account` are a separate app, `identity`, in the same cluster, and it always deploys together with this one.

|                           |                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runs in                   | experience account, ECS service `content-17092020-prod` in cluster `experience-frontend-prod`, eu-west-1. CloudFront and the WAF are global and their metrics and logs are in us-east-1 |
| Public URL or entry point | https://wellcomecollection.org                                                                                                                                                          |
| Users affected if down    | Every page on wellcomecollection.org except `/account`. Pages already in the CloudFront cache keep working for up to an hour                                                            |
| Statuspage component      | Website and Content, on [status.wellcomecollection.org](https://status.wellcomecollection.org)                                                                                          |

Stage (`content-17092020-stage`) runs on Fargate Spot and is switched off outside office hours, so it may not be there to compare against in the evening.

### Capacity

Production runs a fixed six tasks of 2 vCPU and 4 GB each, with no autoscaling. The team runs it at a fixed count on purpose, and the count was raised from three to six in March 2025. CloudFront caching and the WAF rate limits are what absorb traffic spikes, so in a load incident look at the WAF first (see [Bot or scraper traffic](#bot-or-scraper-traffic-slows-or-breaks-the-site)) rather than adding tasks.

To change the count, edit `desired_task_count` in [content/terraform/main.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/content/terraform/main.tf) in a pull request and run the Terraform plan and apply by hand; there is no CI apply for this root. If you have to scale in the ECS console during an incident, raise the pull request straight after, because the next apply puts the count back to what Terraform says.

## How to tell it is broken

The CloudFront alarm is defined in [cache/alarms.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/alarms.tf). The ECS and Lambda alerts come from the shared [monitoring Terraform](https://github.com/wellcomecollection/platform-infrastructure/tree/main/monitoring) (internal) in platform-infrastructure. Alerts that post to #wc-platform-alerts are triaged by the [bug nurse](https://github.com/wellcomecollection/developer-handbook/blob/main/incident-management/bug-nurse.md).

| Signal                                                                                    | Posts to                              | What it means                                                                                                | Go to                                                                      |
| ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `wc-org-prod-cloudfront-5xx-alarm`                                                        | #wc-platform-alerts                   | More than 2% of responses across the whole distribution were 5xx over five minutes. Covers `/account` too    | [First steps](#first-steps)                                                |
| LogicMonitor web checks, for example "WC - What's On" or "WC - Exhibition"                | #wc-platform-alerts, plus email       | A page type is failing or slow from outside. Flapping checks on several page types at once usually mean load | [Bot or scraper traffic](#bot-or-scraper-traffic-slows-or-breaks-the-site) |
| ECS tasks not starting, posted by `experience_alert_on_ecs_tasks_not_starting`            | #wc-platform-alerts                   | ECS cannot start replacement tasks for a service in the experience account                                   | [Tasks cannot start](#tasks-cannot-start-or-keep-restarting)               |
| An IP set updater Lambda alarm, `lambda-*-ip-*` (errors, throttles or validation failure) | #wc-platform-alerts                   | The daily job that refreshes a WAF IP set failed or refused a large change. The site is not down             | [WAF IP set updater alarm](#waf-ip-set-updater-alarm)                      |
| Failed deploy or e2e tests                                                                | Buildkite, and #wc-experience-deploys | A deploy to stage or prod did not finish                                                                     | [Rollback](#rollback)                                                      |
| Reports from colleagues or the public                                                     | #wc-platform-feedback                 | Usually "server error on the home page" or "the site is slow"                                                | [First steps](#first-steps)                                                |

There is no alarm on load balancer errors, response time, or ECS CPU and memory for this service.

Quick checks anyone can run:

- Which commit is live (never cached; each request reaches one task): `curl -s https://wellcomecollection.org/management/manifest`
- Supplier status: [Prismic](https://status.prismic.io/), [AWS](https://health.aws.amazon.com/health/status)
- Deploys: [experience](https://buildkite.com/wellcomecollection/experience) and [experience-deployment](https://buildkite.com/wellcomecollection/experience-deployment) pipelines in Buildkite (internal), and #wc-experience-deploys
- Uptime checks: [LogicMonitor website monitors](https://wellcome.logicmonitor.com/santaba/uiv4/websites) (internal, Wellcome SSO)
- Logs: application logs go to the logging cluster in Elastic Cloud; search Kibana for the service `content-17092020-prod` (internal). WAF logs are in the CloudWatch log group `aws-waf-logs-weco-prod` in us-east-1 and hold only blocked, counted, CAPTCHA and challenged requests. CloudFront access logs go to S3 and are kept for 30 days (see [cache/s3_cloudfront_logs.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/s3_cloudfront_logs.tf))

## First steps

1. **Is it real?** Run the quick checks above and load a few pages in a private window. One alarm with healthy checks may be noise; say so in the alert thread.
2. **Say you are looking.** Reply in the alert thread, or in #wc-incident-response if users are affected.
3. **Did something change?** Look at recent deploys in Buildkite and #wc-experience-deploys, merged pull requests, and Prismic model changes (they are deployed from a laptop, not CI, so they do not show in Buildkite). If a deploy lines up with the start of the problem, roll back first and investigate after (see [Rollback](#rollback)).
4. **Is a dependency down?** Check the status pages in [Dependencies](#dependencies-and-supplier-escalation). If Catalogue API pages fail while Prismic pages work, go to the catalogue API runbook on its [Backplane page](https://backplane.wellcome.digital/catalog/system/default/catalogue-api) (internal).
5. **Get access.** Start with `AWS_PROFILE=experience-read_only`. How to get credentials is in [aws-account-infrastructure](https://github.com/wellcomecollection/aws-account-infrastructure/blob/main/docs/how-to/how-to-get-credentials-for-working-locally.md) (internal). Use `experience-developer` only for the fix itself, and `experience-admin` for CloudFront invalidations.
6. **Is it major?** If people cannot use the website and a fix is not in sight, follow the [major incident playbook](https://github.com/wellcomecollection/developer-handbook/blob/main/incident-management/incident-comms-and-escalation.md). The [site-wide banner](#site-wide-banner) is the quickest way to tell users.

## Common failures and fixes

### Bot or scraper traffic slows or breaks the site

- **Symptom:** LogicMonitor checks flapping on several page types, slow pages, sometimes the CloudFront 5xx alarm. Prismic-backed pages may be slow while the APIs answer quickly.
- **Confirm:** look at request counts by country, IP or user agent in the WAF sampled requests in the console (us-east-1) or the CloudFront access logs. The WAF log group `aws-waf-logs-weco-prod` leaves out allowed requests, so it shows only what the rules already caught. One country or a small set of IPs well above normal is the usual pattern.
- **Cause:** traffic that gets under or around the WAF rules. The rules and their limits are in [cache/modules/wc_org_cloudfront/waf.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/modules/wc_org_cloudfront/waf.tf), which is the source of truth.
- **Fix:** for a few IPs, add them to the `blocklist-prod` IP set, which Terraform deliberately leaves alone. `update-ip-set` replaces the whole list, so pass the current addresses as well as the new ones:

  ```console
  $ export AWS_PROFILE=experience-developer AWS_REGION=us-east-1
  $ ID=$(aws wafv2 list-ip-sets --scope CLOUDFRONT --query "IPSets[?Name=='blocklist-prod'].Id" --output text)
  $ aws wafv2 get-ip-set --scope CLOUDFRONT --name blocklist-prod --id "$ID"
  $ aws wafv2 update-ip-set --scope CLOUDFRONT --name blocklist-prod --id "$ID" --lock-token "LOCK_TOKEN_FROM_GET" --addresses "EXISTING/32" "NEW/32"
  ```

  For a country or a pattern, change the rules in [cache/modules/wc_org_cloudfront/waf.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/modules/wc_org_cloudfront/waf.tf) in a pull request and apply `cache/` by hand. If the load is on search, turning off search filters with the `aggregationsInSearch` toggle takes the most expensive part of the query away (see [Toggles](#toggles)).

- **Watch out:** remove blocklist entries once the traffic stops; nothing expires them. A `cache/` apply changes the prod, stage and e2e distributions together, so read the plan.
- **Seen in:** [2023-09-02](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2023-09-02_web_site_not_available.md), [2026-02-04](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2026-02-04_slow_web_site.md), [wellcomecollection.org#12767](https://github.com/wellcomecollection/wellcomecollection.org/issues/12767)

### A Prismic model change breaks pages

- **Symptom:** server errors on some or all Prismic-backed pages soon after someone publishes in Prismic. The logs show errors such as `Cannot find slice of type imageList`.
- **Confirm:** check whether a custom type was deployed with Slice Machine recently (ask in the team channel; it does not go through CI) and match the missing field or slice in the logs to it.
- **Cause:** the model and the app's queries changed in the wrong order, so the app asks for a field or slice Prismic no longer has, or does not yet have. Model changes only show in the API once something is published.
- **Fix:** revert the model change with Slice Machine, then publish any piece of content so the API picks it up. Then invalidate the cache (see [Clearing the CloudFront cache](#clearing-the-cloudfront-cache)). The safe order for model changes is in the [prismic-model README](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/README.md#updating-an-existing-custom-type).
- **Watch out:** a redeploy of the app does not fix this on its own unless the app change it needs is already on main.
- **Seen in:** [2023-06-12](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2023-06-12_prismic_model_changes.md), [2023-08-10](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2023-08-10_wc.org_intermittently_available.md), and earlier in 2021 and 2022

### Prismic or AWS is down

- **Symptom:** the home page, what's on and exhibitions show an error while search and works pages still work.
- **Confirm:** [Prismic status](https://status.prismic.io/) and the [AWS Health dashboard](https://health.aws.amazon.com/health/status). A us-east-1 problem can affect Prismic, CloudFront control actions and the uptime checks at once.
- **Cause:** pages that need Prismic fetch it when they render; there is no fallback copy of the content.
- **Fix:** turn on the [site-wide banner](#site-wide-banner) and update Statuspage. Then wait for the supplier, and invalidate the cache once they recover so cached error pages go.
- **Watch out:** in 2025 the banner took about 25 minutes to appear because toggles are served through CloudFront and S3, which were affected too, and a code change to show a banner was blocked because CI steps depended on Prismic. The Prismic model diff step is now non-blocking and asks for an acknowledgement instead.
- **Seen in:** [2025-10-20](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2025-10-20_parts-of-wc.org_not_available.md), [wellcomecollection.org#12452](https://github.com/wellcomecollection/wellcomecollection.org/issues/12452) (open, longer-term mitigation)

### Tasks cannot start or keep restarting

- **Symptom:** the ECS tasks-not-starting alert, fewer running tasks than six, or a deploy that never becomes stable.
- **Confirm:**

  ```console
  $ AWS_PROFILE=experience-read_only aws ecs describe-services --region eu-west-1 --cluster experience-frontend-prod --services content-17092020-prod --query 'services[0].[desiredCount,runningCount,events[:10]]'
  ```

- **Cause:** varies: a bad image, a missing secret, a health check that fails (`/management/healthcheck`), or tasks running out of memory.
- **Fix:** if a deploy started it, [roll back](#rollback). If the image is good and tasks are stuck, start fresh tasks:

  ```console
  $ AWS_PROFILE=experience-developer aws ecs update-service --region eu-west-1 --cluster experience-frontend-prod --service content-17092020-prod --force-new-deployment
  $ AWS_PROFILE=experience-developer aws ecs wait services-stable --region eu-west-1 --cluster experience-frontend-prod --services content-17092020-prod
  ```

- **Watch out:** the service keeps 100% of its tasks running during a deployment, so a forced deployment starts new tasks and stops the old ones only once the new ones pass the health check. It is safe to run on a working service.
- **Seen in:** [2026-02-04](https://github.com/wellcomecollection/docs/blob/main/incident_retros/2026-02-04_slow_web_site.md) (a faulty deployment, fixed with a fresh one)

### WAF IP set updater alarm

- **Symptom:** an IP set updater Lambda alarm (`lambda-*-ip-*`) in #wc-platform-alerts.
- **Confirm and fix:** follow the [WAF IP set updaters README](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/ip-updaters/README.md), which covers manual runs and the "exceeds maximum allowed" validation failure.
- **Watch out:** the site keeps working on yesterday's list. A list that stays stale for long can start blocking legitimate traffic, so fix it within a working day.

## Toggles

Toggles change what the site does without a deploy. The full guide is the [toggles README](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/toggles/README.md). To change what the public sees, run this from `toggles/webapp` after `yarn install` at the repo root:

```console
$ yarn setDefaultValueFor --TOGGLE_ID=true
```

The script writes `toggles.json` in S3 using the `experience-developer` role and invalidates it in CloudFront using `experience-admin`, so your credentials must be able to assume both. Each running task re-reads the file once a minute and keeps its last good copy if the fetch fails. Pages already in the CloudFront cache keep the old value for up to an hour unless you [clear the cache](#clearing-the-cloudfront-cache). `toggles.json` is shared by stage and prod.

The toggles that matter in an incident:

| Toggle                 | What it does                                                                                                         | Runbook                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `issuesBanner`         | Shows a banner on every page saying the site has problems. The text is in the code, so it works when Prismic is down | [Site-wide banner](#site-wide-banner)                                                                                           |
| `disableRequesting`    | Stops item requests on works pages and shows a "requesting unavailable" message                                      | [How to disable requesting](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/docs/turn-off-requesting.md) |
| `aggregationsInSearch` | On by default. Set it to `false` to drop search filters and take load off the catalogue API's Elasticsearch          | This page, [Bot or scraper traffic](#bot-or-scraper-traffic-slows-or-breaks-the-site)                                           |

### Site-wide banner

```console
$ yarn setDefaultValueFor --issuesBanner=true
```

Wait two minutes, check a page with a cache-busting query string (for example `https://wellcomecollection.org/?cb=1`), then [clear the cache](#clearing-the-cloudfront-cache) so cached pages show it too. Set it back to `false` and clear the cache again when the incident is over.

### Clearing the CloudFront cache

```console
$ export AWS_PROFILE=experience-admin
$ DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, 'wellcomecollection.org')].Id" --output text)
$ INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query "Invalidation.Id" --output text)
$ aws cloudfront wait invalidation-completed --distribution-id "$DISTRIBUTION_ID" --id "$INVALIDATION_ID"
```

Narrow `--paths` if you can (for example `/works/*` and `/_next/data/*`). Clearing everything sends a burst of requests to the six tasks while the cache refills, so avoid it while the site is struggling under load.

## Rollback

Follow the general [rollback guide](https://github.com/wellcomecollection/developer-handbook/blob/main/developer-handbook/rollback.md) first. The [change model](https://github.com/wellcomecollection/developer-handbook/blob/main/developer-handbook/change-model.md) says which kinds of change need which route. For this service:

- **How it deploys:** a merge to main runs the [experience](https://buildkite.com/wellcomecollection/experience) pipeline (internal), which builds and tests the apps and pushes an image tagged `ref.COMMIT` to ECR. It then starts a stage deployment in [experience-deployment](https://buildkite.com/wellcomecollection/experience-deployment) (internal), which points the `env.stage` tag at that image, restarts the content and identity services and runs the e2e tests. Prod waits behind a manual "Allow prod deployment?" step in the same build, then does the same with `env.prod`. The deploy tracker reports each step in #wc-experience-deploys.
- **To roll back a code change:** revert the pull request and let it go through the pipeline. That is the normal route and keeps main, stage and prod in step. If that is too slow, point prod back at the last good image while the revert goes through. Find the last good commit from #wc-experience-deploys or the previous prod build in experience-deployment. The image tag uses the full 40-character commit SHA, the same value `/management/manifest` reports. Then, from a checkout of the repo with `jq` installed:

  ```console
  $ export AWS_PROFILE=experience-developer AWS_REGION=eu-west-1
  $ aws ecr describe-images --repository-name uk.ac.wellcome/content_webapp --image-ids imageTag=ref.GOOD_COMMIT
  $ ENV_TAG=env.prod LATEST_TAG=ref.GOOD_COMMIT .buildkite/scripts/update_ecr_image_tag.sh uk.ac.wellcome/content_webapp uk.ac.wellcome/identity_webapp
  $ CLUSTER=experience-frontend-prod .buildkite/scripts/deploy_ecs_services.sh content-17092020-prod identity-18012021-prod
  ```

  These are the same two scripts the pipeline runs, so content and identity move together. ECR keeps only the ten most recent images that are not tagged `env.*` or `latest`, so a commit more than about ten merges back may no longer have an image.

- **Cannot be rolled back this way:**
  - Prismic model changes: revert in Slice Machine and publish something (see [A Prismic model change breaks pages](#a-prismic-model-change-breaks-pages)). For lost content, the [Prismic disaster recovery runbook](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/prismic_disaster_recovery_full.md).
  - Terraform changes in `content/terraform`, `cache/` (CloudFront, WAF, edge Lambda versions) or `infrastructure/`: revert the pull request and apply the root by hand.
  - Static files in `assets/` (robots.txt, fonts, icons): every build on main copies them to S3 straight away, before stage. Revert on main.
  - Toggle values: set them back with `yarn setDefaultValueFor`.
- **Check it worked:** `curl -s https://wellcomecollection.org/management/manifest` a few times shows the good commit from every task, then clear the cache if the bad version may be cached.
- **Do not use** `yarn deploy-dev`, which only deploys to stage, or the rollback steps in the [developer handbook runbook](https://github.com/wellcomecollection/developer-handbook/blob/main/developer-handbook/runbook.md), which describe a Docker Hub route that no longer exists.

## Dependencies and supplier escalation

Suppliers who build or run part of this service are listed as vendors on the [Backplane entity](https://backplane.wellcome.digital/catalog/component/default/content) (internal). Their support contacts, contract terms and severity definitions are in [suppliers.md](https://github.com/wellcomecollection/private/blob/main/suppliers.md) (private).

| Dependency                                            | What breaks if it is down                                                                   | How to check it                                                                                                                    | Who escalates, and how                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Prismic                                               | Home, what's on, exhibitions, events and stories pages                                      | [status.prismic.io](https://status.prismic.io/)                                                                                    | Engineer on the incident, through the support route in suppliers.md (private)             |
| Catalogue, Concepts and Items APIs                    | Works, images and concepts pages and search, item requesting                                | Catalogue API runbook via its [Backplane page](https://backplane.wellcome.digital/catalog/system/default/catalogue-api) (internal) | Owning team, via its Backplane team page                                                  |
| Content API                                           | Story and event search, and the story and event lists on the home, events and stories pages | [content-api](https://github.com/wellcomecollection/content-api)                                                                   | Owning team, via its Backplane team page                                                  |
| IIIF image service and DLCS                           | Images and the item viewer; the rest of the page loads                                      | Image Services on [status.wellcomecollection.org](https://status.wellcomecollection.org)                                           | Engineer on the incident, through the supplier's shared channel in suppliers.md (private) |
| Toggles (S3 and CloudFront in the experience account) | Nothing at once: tasks keep their last good copy. Toggle changes stop taking effect         | `curl -s https://toggles.wellcomecollection.org/toggles.json`                                                                      | This team                                                                                 |
| AWS (CloudFront, ECS, S3)                             | Anything from one region's control actions to the whole site                                | [AWS Health dashboard](https://health.aws.amazon.com/health/status)                                                                | Engineer on the incident, with a support case from the experience account                 |

## Related links

- Architecture page: [docs/architecture/services/frontend/content_frontend.md](https://github.com/wellcomecollection/docs/blob/main/architecture/services/frontend/content_frontend.md)
- [CloudFront, edge Lambdas and A/B tests](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/README.md)
- [Prismic model changes](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/README.md) and the [Prismic disaster recovery runbook](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/prismic-model/prismic_disaster_recovery_full.md)
- [How to disable requesting](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/docs/turn-off-requesting.md) and [what happens when you request an item](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/docs/item-requesting.md)
- [Deploying dev builds to stage](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/deploy/README.md)
- [Incident retros](https://github.com/wellcomecollection/docs/tree/main/incident_retros)
