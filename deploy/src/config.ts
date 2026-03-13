export const ECR_REGISTRY = '130871440101.dkr.ecr.eu-west-1.amazonaws.com';
export const ECR_PUBLIC_REGISTRY = 'public.ecr.aws';
export const ECR_REGION = 'eu-west-1';
export const ECR_PUBLIC_REGION = 'us-east-1';
export const CLUSTER = 'experience-frontend-stage';
export const DEV_TAG = 'dev';
export const ENV_TAG = 'env.stage';
export const BACKUP_TAG = 'env.stage.pre-dev';

export type AppName = 'content' | 'identity';

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

export function getAppConfig(app: AppName) {
  return APP_CONFIG[app];
}
