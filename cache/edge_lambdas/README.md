# edge_lambdas

## Updating the Lambda deployment package

Normally this happens in Buildkite, but you can also build a deployment package locally if you're testing something.

1.  Build the Lambda deployment package by running this command in the root of the repo:

    ```
    docker compose build edge_lambdas
    ```

2.  Upload the Lambda deployment package by running this command in the root of the repo:

    ```
    AWS_PROFILE=experience-dev docker compose run edge_lambdas yarn deploy
    ```


## Deploying the Edge Lambda to CloudFront

1.  In the `cache` folder, apply the Terraform to use the latest Lambda in staging:

    ```
    terraform plan -out=terraform.plan
    terraform apply terraform.plan
    ```

    Among the outputs will be the edge Lambda version IDs, e.g.

    ```
    latest_edge_lambda_origin_request_version = "83"
    latest_edge_lambda_origin_response_version = "84"
    ```

2.  Check your changes are working correctly on <www-stage.wellcomecollection.org>

3.  Update the version numbers in [`locals.tf`](../locals.tf), then re-run Terraform to update the Lambdas in prod.
