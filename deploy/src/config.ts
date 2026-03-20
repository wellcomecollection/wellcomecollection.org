/**
 * AWS ECR and ECS configuration for deploying dev builds to staging.
 *
 * Tag strategy:
 * - DEV_TAG: Fresh builds from local development
 * - ENV_TAG: The active tag running in the staging environment
 * - BACKUP_TAG: Previous ENV_TAG image, saved before deploying new dev build
 */

/** Private ECR registry for Wellcome Collection images */
export const ECR_REGISTRY = '130871440101.dkr.ecr.eu-west-1.amazonaws.com';

/** Public ECR registry (for base image pulls during docker build) */
export const ECR_PUBLIC_REGISTRY = 'public.ecr.aws';

/** AWS region for private ECR and ECS */
export const ECR_REGION = 'eu-west-1';

/** Public ECR is always in us-east-1 */
export const ECR_PUBLIC_REGION = 'us-east-1';

/** Staging ECS cluster name */
export const CLUSTER = 'experience-frontend-stage';

/** Tag for dev builds pushed from local machine */
export const DEV_TAG = 'dev';

/** Tag for the image currently running in staging */
export const ENV_TAG = 'env.stage';

/** Backup tag for the previous staging image (for rollback) */
export const BACKUP_TAG = 'env.stage.pre-dev';

/** Supported applications that can be deployed */
export type AppName = 'content' | 'identity';

/** Configuration mapping for each deployable app */
export const APP_CONFIG: Record<AppName, { repo: string; service: string }> = {
  content: {
    repo: 'uk.ac.wellcome/content_webapp',
    service: 'content-17092020-stage',
  },
  identity: {
    repo: 'uk.ac.wellcome/identity_webapp',
    service: 'identity-18012021-stage',
  },
};

/**
 * Get the ECR repository and ECS service names for an app.
 * @param app - The application to get config for
 * @returns Repository and service names
 */
export function getAppConfig(app: AppName) {
  return APP_CONFIG[app];
}
