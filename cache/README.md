# Cache
## Working title: Moneta

We use CloudFormation for our cache in front of wellcomecollection.org.

We have lambda@edge running on these ditributions to allow us to:
* Redirect traffic at the edge, so not having to have a service lookup, and the
  latency that entails.
* Redirect traffic comming to the now deprecated service wellcomeimages.org.
  The URLs are still all over the internet, and other references are being used
  on wellcomelibrary.org to serve up images.
* Randomly assign values to certain toggles for A/B testing in our applications
  by sending and setting cookies.

We have 2 ditributions:
* Dev: This has devcache.wellcomecollection.org pointing to it. We can then
  deploy changes to the lambdas and distro before applying those to prod as
  we have no "local" CloudFormation to do this.
* Prod: This has wellcomecollection.org, and others, pointing to it. The
  lambda@edge version is fixed is fixed on this distro.

## Deployement of lambda@edge
* Run `terraform apply` to deploy the latest lambda versions to the devcache cloudfront distribution and make note of the `edge_lambda_request_version` and `edge_lambda_response_version` numbers output to the console.
* Once deployed check devcache.wellcomecollection.org to make sure everything is working as expected.
  * __Note:__ these are origin (not viewer) lambdas, so if something has been cached previously, you'll either have to invalidate the cache or wait for it to flush.
* To deploy to production bump the `edge_lambda_request_version` and `edge_lambda_response_version` in terraform.tf to the new version numbers and run `terraform apply`
