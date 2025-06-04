# edge_lambdas

## Updating the Lambda deployment package

Normally this happens in Buildkite, but you can also build and deploy a package locally if you're testing something.

### Local deployment

1.  Navigate to the edge_lambdas directory:

    ```
    cd cache/edge_lambdas
    ```

2.  Install dependencies (if not already installed):

    ```
    yarn
    ```

3.  Build, package, and deploy to S3:

    ```
    AWS_PROFILE=experience-developer yarn deploy
    ```

    This command will:
    - Build the TypeScript project
    - Package it into a zip file
    - Upload to S3 (only if changes are detected)


### Docker-based deployment

You can still use the Docker-based approach if preferred:

1.  Build the Lambda deployment package by running this command in the root of the repo:

    ```
    docker compose build edge_lambdas
    ```

2.  Upload the Lambda deployment package by running this command in the root of the repo:

    ```
    AWS_PROFILE=experience-developer docker compose run edge_lambdas yarn deploy
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
