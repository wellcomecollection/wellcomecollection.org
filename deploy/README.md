# deploy

Build and deploy dev images to the staging ECS environment.

This tool builds a Docker image for the **content** or **identity** app, pushes it to ECR with a `dev` tag, retags it as `env.stage`, and triggers an ECS redeployment in the staging cluster. It also backs up the previous `env.stage` image so you can restore it later.

## Prerequisites

You need the following AWS profiles configured in `~/.aws/config`:

- **platform-developer** — used for public ECR login (base image pulls)
- **experience-developer** — used for private ECR operations and ECS deployments

You also need Docker running locally.

## Error Handling

The tool validates operations and provides actionable error messages:

- **AWS credential/permission errors** propagate with full details (not silently ignored)
- **Network failures** are reported with context about which operation failed
- **Docker daemon errors** show Docker's error output (e.g., "Cannot connect to the Docker daemon")
- **Missing images** are clearly distinguished from infrastructure failures
- **Repository configuration errors** surface when repository names in config.ts don't match AWS

Common issues:
- If Docker login fails, ensure Docker is running and your AWS credentials are valid
- If image not found, check the tag exists: `aws ecr describe-images --repository-name <repo>`
- If repository not found, verify repository names in `deploy/src/config.ts` match ECR
- If deployment times out, check ECS console for task health issues

## Usage

Start Docker.

Then, from the repo root:

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

**Note:** Restore will fail if no backup exists (i.e., you haven't deployed a dev build yet, or the backup tag was manually deleted). The tool always creates a backup before deploying, so you can safely restore after any dev deployment.
