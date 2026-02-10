#!/usr/bin/env bash
<<EOF
Build and deploy a dev image to the staging ECS environment.

This script builds a Docker image for the content or identity app, pushes it
to ECR with a 'dev' tag, retags it as 'env.stage', and triggers an ECS
redeployment in the staging cluster.

== Prerequisites ==

You need the following AWS profiles configured:
  - platform-developer (for public.ecr.aws login)
  - experience-developer (for private ECR login and ECS operations)

== Usage ==

    ./scripts/deploy-dev.sh content

        Builds and deploys the content webapp to staging.
        Saves the current env.stage image as env.stage.pre-dev before overwriting.

    ./scripts/deploy-dev.sh identity

        Builds and deploys the identity webapp to staging.

    ./scripts/deploy-dev.sh restore content

        Restores the content webapp env.stage tag to the pre-dev backup.

    ./scripts/deploy-dev.sh restore identity

        Restores the identity webapp env.stage tag to the pre-dev backup.

EOF

set -o errexit
set -o nounset

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ECR_REGISTRY="130871440101.dkr.ecr.eu-west-1.amazonaws.com"
ECR_PUBLIC_REGISTRY="public.ecr.aws"
CLUSTER="experience-frontend-stage"
DEV_TAG="dev"
ENV_TAG="env.stage"
BACKUP_TAG="env.stage.pre-dev"

# App configuration
get_repo() {
    case "$1" in
        content)  echo "uk.ac.wellcome/content_webapp" ;;
        identity) echo "uk.ac.wellcome/identity_webapp" ;;
        *)        return 1 ;;
    esac
}

get_service() {
    case "$1" in
        content)  echo "content-17092020-stage" ;;
        identity) echo "identity-18012021-stage" ;;
        *)        return 1 ;;
    esac
}

# Get script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
    echo -e "${YELLOW}Usage:${NC} $0 <command> [app]"
    echo ""
    echo "Commands:"
    echo "  content     Build and deploy content webapp to staging"
    echo "  identity    Build and deploy identity webapp to staging"
    echo "  restore     Restore an app to its pre-dev state"
    echo ""
    echo "Examples:"
    echo "  $0 content           # Build and deploy content webapp"
    echo "  $0 identity          # Build and deploy identity webapp"
    echo "  $0 restore content   # Restore content to pre-dev state"
    echo "  $0 restore identity  # Restore identity to pre-dev state"
    exit 1
}

log_info() {
    echo -e "${BLUE}==>${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

# Get all tags for an image by its digest
get_image_tags() {
    local repo="$1"
    local digest="$2"

    aws ecr describe-images \
        --profile experience-developer \
        --repository-name "$repo" \
        --image-ids imageDigest="$digest" \
        --query 'imageDetails[0].imageTags' \
        --output json 2>/dev/null | jq -r '.[]?' 2>/dev/null || true
}

# Find the ref.* tag for an image tagged with a given tag
get_ref_tag_for_image() {
    local repo="$1"
    local tag="$2"

    # Get the digest for the tagged image
    local digest
    digest=$(
        aws ecr describe-images \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-ids imageTag="$tag" \
            --query 'imageDetails[0].imageDigest' \
            --output text 2>/dev/null
    ) || true

    if [[ -z "$digest" || "$digest" == "None" ]]; then
        return
    fi

    # Get all tags for this digest and find the ref.* tag
    get_image_tags "$repo" "$digest" | grep '^ref\.' | head -1
}

# Backup the current env.stage tag before overwriting
backup_current_tag() {
    local app="$1"
    local repo
    repo=$(get_repo "$app")

    log_info "Backing up current $ENV_TAG tag..."

    # Get the manifest for the current env.stage tag
    local current_manifest
    current_manifest=$(
        aws ecr batch-get-image \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-ids imageTag="$ENV_TAG" \
            --output json \
            | jq --raw-output --join-output '.images[0].imageManifest'
    ) || true

    if [[ -z "$current_manifest" || "$current_manifest" == "null" ]]; then
        log_info "No existing $ENV_TAG tag found, skipping backup"
        return
    fi

    # Find the ref tag for the current image
    local ref_tag
    ref_tag=$(get_ref_tag_for_image "$repo" "$ENV_TAG")
    if [[ -n "$ref_tag" ]]; then
        log_info "Current $ENV_TAG points to: $ref_tag"
    fi

    # Create backup tag
    aws ecr put-image \
        --profile experience-developer \
        --repository-name "$repo" \
        --image-tag "$BACKUP_TAG" \
        --image-manifest "$current_manifest" >/dev/null 2>&1 || true

    log_success "Saved current image as $BACKUP_TAG"
    if [[ -n "$ref_tag" ]]; then
        echo -e "         To restore later, run: ${YELLOW}$0 restore $app${NC}"
    fi
}

# Restore env.stage from the backup tag
restore_from_backup() {
    local app="$1"
    local repo service
    repo=$(get_repo "$app")
    service=$(get_service "$app")

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Restoring $app to pre-dev state${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    log_info "Looking for backup tag $BACKUP_TAG..."

    # Get the manifest for the backup tag
    local backup_manifest
    backup_manifest=$(
        aws ecr batch-get-image \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-ids imageTag="$BACKUP_TAG" \
            --output json \
            | jq --raw-output --join-output '.images[0].imageManifest'
    ) || true

    if [[ -z "$backup_manifest" || "$backup_manifest" == "null" ]]; then
        log_error "No backup tag ($BACKUP_TAG) found for $repo"
        log_error "Cannot restore - no previous deployment was saved"
        exit 1
    fi

    # Find the ref tag for the backup image
    local ref_tag
    ref_tag=$(get_ref_tag_for_image "$repo" "$BACKUP_TAG")
    if [[ -n "$ref_tag" ]]; then
        log_info "Backup image is: $ref_tag"
    fi

    # Restore env.stage to point to the backup
    log_info "Restoring $ENV_TAG from $BACKUP_TAG..."
    aws ecr put-image \
        --profile experience-developer \
        --repository-name "$repo" \
        --image-tag "$ENV_TAG" \
        --image-manifest "$backup_manifest" >/dev/null
    log_success "Restored $ENV_TAG tag"

    # Redeploy the service
    echo ""
    log_info "Forcing new deployment of $service in $CLUSTER..."
    aws ecs update-service \
        --profile experience-developer \
        --cluster "$CLUSTER" \
        --service "$service" \
        --force-new-deployment >/dev/null
    log_success "Triggered deployment"

    log_info "Waiting for $service to become stable (this may take a few minutes)..."
    aws ecs wait services-stable \
        --profile experience-developer \
        --cluster "$CLUSTER" \
        --service "$service"
    log_success "$service is stable"

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Successfully restored $app${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

ecr_login() {
    log_info "Logging in to ECR registries..."

    # Login to public ECR (needed for base images)
    log_info "Logging in to public ECR ($ECR_PUBLIC_REGISTRY)..."
    aws ecr-public get-login-password \
        --region us-east-1 \
        --profile platform-developer | docker login \
        --username AWS \
        --password-stdin "$ECR_PUBLIC_REGISTRY"
    log_success "Logged in to public ECR"

    # Login to private ECR
    log_info "Logging in to private ECR ($ECR_REGISTRY)..."
    aws ecr get-login-password \
        --profile experience-developer | docker login \
        --username AWS \
        --password-stdin "$ECR_REGISTRY"
    log_success "Logged in to private ECR"
}

build_image() {
    local app="$1"
    local repo
    repo=$(get_repo "$app")
    local image_uri="$ECR_REGISTRY/$repo:$DEV_TAG"
    local dockerfile="$app/Dockerfile"

    log_info "Building $app image..."
    log_info "  Dockerfile: $dockerfile"
    log_info "  Tag: $image_uri"
    log_info "  Platform: linux/amd64"

    docker build \
        -f "$dockerfile" \
        . \
        --platform linux/amd64 \
        -t "$image_uri"

    log_success "Built $app image"
}

push_image() {
    local app="$1"
    local repo
    repo=$(get_repo "$app")
    local image_uri="$ECR_REGISTRY/$repo:$DEV_TAG"

    log_info "Pushing $app image to ECR..."
    docker push "$image_uri"
    log_success "Pushed $app image"
}

retag_image() {
    local app="$1"
    local repo
    repo=$(get_repo "$app")

    log_info "Retagging $DEV_TAG -> $ENV_TAG for $repo..."

    # Get the manifest for the dev tag
    local dev_manifest
    dev_manifest=$(
        aws ecr batch-get-image \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-ids imageTag="$DEV_TAG" \
            --output json \
            | jq --raw-output --join-output '.images[0].imageManifest'
    )

    if [[ "$dev_manifest" == "null" || -z "$dev_manifest" ]]; then
        log_error "Could not find image with tag $DEV_TAG in $repo"
        exit 1
    fi

    # Get the manifest for the env tag (if it exists)
    local env_manifest
    env_manifest=$(
        aws ecr batch-get-image \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-ids imageTag="$ENV_TAG" \
            --output json \
            | jq --raw-output --join-output '.images[0].imageManifest'
    ) || true

    # Only retag if different
    if [[ "$dev_manifest" != "$env_manifest" ]]; then
        aws ecr put-image \
            --profile experience-developer \
            --repository-name "$repo" \
            --image-tag "$ENV_TAG" \
            --image-manifest "$dev_manifest" >/dev/null
        log_success "Retagged image as $ENV_TAG"
    else
        log_success "Image already tagged as $ENV_TAG, skipping retag"
    fi
}

deploy_service() {
    local app="$1"
    local service
    service=$(get_service "$app")

    log_info "Forcing new deployment of $service in $CLUSTER..."
    aws ecs update-service \
        --profile experience-developer \
        --cluster "$CLUSTER" \
        --service "$service" \
        --force-new-deployment >/dev/null
    log_success "Triggered deployment"

    log_info "Waiting for $service to become stable (this may take a few minutes)..."
    aws ecs wait services-stable \
        --profile experience-developer \
        --cluster "$CLUSTER" \
        --service "$service"
    log_success "$service is stable"
}

main() {
    if [[ $# -lt 1 ]]; then
        log_error "Missing required argument"
        usage
    fi

    local command="$1"

    # Handle restore command
    if [[ "$command" == "restore" ]]; then
        if [[ $# -lt 2 ]]; then
            log_error "Missing app argument for restore"
            echo "Usage: $0 restore <content|identity>"
            exit 1
        fi
        local app="$2"
        if ! get_repo "$app" >/dev/null 2>&1; then
            log_error "Invalid app: $app"
            echo "Valid apps: content, identity"
            exit 1
        fi
        restore_from_backup "$app"
        exit 0
    fi

    # Otherwise, command is the app name
    local app="$command"

    # Validate app argument
    if ! get_repo "$app" >/dev/null 2>&1; then
        log_error "Invalid app or command: $app"
        echo "Valid apps: content, identity"
        echo "Valid commands: restore"
        exit 1
    fi

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Deploying $app to staging${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    # Change to repo root for docker build context
    cd "$REPO_ROOT"

    ecr_login
    echo ""
    build_image "$app"
    echo ""
    push_image "$app"
    echo ""
    backup_current_tag "$app"
    echo ""
    retag_image "$app"
    echo ""
    deploy_service "$app"

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Successfully deployed $app to staging${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

main "$@"
