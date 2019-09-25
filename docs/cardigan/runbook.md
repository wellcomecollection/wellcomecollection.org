# Monitoring

We use a combination of methods to let us monitor the health of our system.

## Alerting
All errors are sent to out #dotorg-explosions channel in Wellcome's Slack
account.

* [Sentry (client)](https://sentry.io/wellcome/wellcomecollection-website-client/)
  used to monitor the client JS.
* [Sentry (server)](https://sentry.io/wellcome/wellcomecollection-website-server/)
  used to monitor any errors occuring on the server JS.
* [CloudWatch 500 errors](https://github.com/wellcometrust/wellcomecollection.org/blob/d215a7ccc392d7da8405e799513e247c20131c21/infra/terraform/templates/alb.tf#L76-L91)
  500 errors from the `wellcomecollection` ALB

## Health and performance
The health and performance of our system is monitored by a number of dashboards.

* [Pa11y](https://dash.wellcomecollection.org/pa11y/report.latest.html)
* [Speedtracker](http://ghp.wellcomecollection.org/speedtracker/)
* [Datastudio](https://datastudio.google.com)
* Application bundle size
  * [Catalogue](https://dash.wellcomecollection.org/bundles/catalogue.browser.latest.html)


# Troubleshooting
We run on a **roll forward** methodology, trying to fix and improve the site
rather than roll back.

However, if core functionality is at stake, **rolling back** is the quickest way
to relieve pressure, so that we can roll forward.

## Rolling back
We can roll back to any Docker container we have built. You can find the Docker
containers publicly hosted on [Docker Hub](https://hub.docker.com/r/wellcome/).

To roll back, find the docker container you need<sup>*</sup>, then run
[`./deploy/terraform_deploy_service.sh <SERVICE_NAME> <DOCKER_CONTAINER_TAG>`](../deploy).

Once rolled back, we can start diagnosing the problem.

<sup>*</sup> The process here still needs work, as we have no way of indicating
the last docker build we considered healthy.

## Diagnosing the problem
If the alert was from sentry, it is easy to extract where the error happend. Get
the URL, and start diagnosing locally.

If the error was from CloudWatch, we store the logs locally in S3,
go into Athena, and run the `ALB Logging - create` saved query, followed by
`5xx errors` saved query. You should be able to spot the location of the error
from there<sup>**</sup>.

<sup>**</sup> These should be saved in terraform, but currently aren't.

# Testing
TBD
