# Cache

We use CloudFormation for the cache of wellcomecollection.org.


## lambda@edge

We use lambda@edge to allow us to:

* Redirect traffic at the edge, mitigating against any latency of having to route to a service.
* Randomly assign values to certain toggles for A/B testing in our applications by sending and setting cookies.

## Deployement of lambda@edge

* Run `terraform apply` to deploy the latest lambda versions to the `stage` cloudfront distribution
* Make note of the `edge_lambda_request_version` and `edge_lambda_response_version` numbers output to the console
* Once deployed check [www-stage.wellcomecollection.org](www-stage.wellcomecollection.org) to make sure everything is working as expected
* To deploy to `prod` bump the `edge_lambda_request_version` and `edge_lambda_response_version` in [`terraform.tf`](./terraform.tf) to the new versions
* Run `terraform apply`
