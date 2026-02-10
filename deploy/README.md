# deploy

Build and deploy dev images to the staging ECS environment.

This tool builds a Docker image for the **content** or **identity** app, pushes it to ECR with a `dev` tag, retags it as `env.stage`, and triggers an ECS redeployment in the staging cluster. It also backs up the previous `env.stage` image so you can restore it later.

## Prerequisites

You need the following AWS profiles configured in `~/.aws/config`:

- **platform-developer** — used for public ECR login (base image pulls)
- **experience-developer** — used for private ECR operations and ECS deployments

You also need Docker running locally.

## Usage

From the repo root:

```sh
# Build and deploy the content webapp to staging
yarn deploy-dev content

# Build and deploy the identity webapp to staging
yarn deploy-dev identity

# Restore an app to its pre-dev state
yarn deploy-dev restore content
yarn deploy-dev restore identity

# Show help
yarn deploy-dev --help
```

Or from the `deploy/` directory:

```sh
yarn deploy-dev content
```

## What it does

### Deploy

1. Logs in to public ECR (for base images) and private ECR
2. Builds a Docker image using the app's Dockerfile with the repo root as build context
3. Pushes the image to ECR with a `dev` tag
4. Backs up the current `env.stage` image as `env.stage.pre-dev`
5. Retags the `dev` image as `env.stage`
6. Forces an ECS redeployment and waits for the service to stabilise

### Restore

1. Finds the `env.stage.pre-dev` backup image
2. Retags it back to `env.stage`
3. Forces an ECS redeployment and waits for the service to stabilise
