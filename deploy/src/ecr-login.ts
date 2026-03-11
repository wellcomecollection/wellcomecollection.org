import { ECRClient, GetAuthorizationTokenCommand } from '@aws-sdk/client-ecr';
import {
  ECRPUBLICClient,
  GetAuthorizationTokenCommand as GetPublicAuthTokenCommand,
} from '@aws-sdk/client-ecr-public';
import type { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { execFileSync } from 'child_process';

import { logInfo, logSuccess } from '@weco/common/utils/console-logs';

import {
  ECR_PUBLIC_REGION,
  ECR_PUBLIC_REGISTRY,
  ECR_REGION,
  ECR_REGISTRY,
} from './config';

/**
 * Authenticate Docker with an ECR registry using a password.
 *
 * Executes `docker login --password-stdin` to avoid exposing credentials in process lists.
 * Inherits stderr so Docker error messages are visible if login fails.
 *
 * @param registry - ECR registry URL to authenticate with
 * @param password - ECR authorization token (from AWS API)
 * @throws Error with context if Docker login fails
 */
function dockerLogin(registry: string, password: string): void {
  try {
    execFileSync(
      'docker',
      ['login', '--username', 'AWS', '--password-stdin', registry],
      {
        input: password,
        // Inherit stderr so Docker error messages are visible if login fails
        stdio: ['pipe', 'pipe', 'inherit'],
      }
    );
  } catch (error) {
    throw new Error(`Docker login failed for ${registry}. Is Docker running?`, {
      cause: error,
    });
  }
}

/**
 * Authenticate Docker with the public ECR registry.
 *
 * Public ECR is used for pulling public base images during docker build.
 * Requires AWS credentials (platform-developer profile).
 *
 * @param credentials - AWS credential provider (optional, uses default if not provided)
 */
export async function loginToPublicEcr(
  credentials?: AwsCredentialIdentityProvider
): Promise<void> {
  logInfo(`Logging in to public ECR (${ECR_PUBLIC_REGISTRY})...`);

  const client = new ECRPUBLICClient({
    region: ECR_PUBLIC_REGION,
    credentials,
  });

  const response = await client.send(new GetPublicAuthTokenCommand({}));
  const token = response.authorizationData?.authorizationToken;

  if (!token) {
    throw new Error('Failed to get public ECR authorization token');
  }

  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const password = decoded.split(':')[1];

  dockerLogin(ECR_PUBLIC_REGISTRY, password);
  logSuccess('Logged in to public ECR');
}

/**
 * Authenticate Docker with the private ECR registry.
 *
 * Private ECR hosts Wellcome Collection's application images.
 * Requires AWS credentials (experience-developer profile).
 *
 * @param credentials - AWS credential provider (optional, uses default if not provided)
 */
export async function loginToPrivateEcr(
  credentials?: AwsCredentialIdentityProvider
): Promise<void> {
  logInfo(`Logging in to private ECR (${ECR_REGISTRY})...`);

  const client = new ECRClient({
    region: ECR_REGION,
    credentials,
  });

  const response = await client.send(new GetAuthorizationTokenCommand({}));
  const token = response.authorizationData?.[0]?.authorizationToken;

  if (!token) {
    throw new Error('Failed to get private ECR authorization token');
  }

  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const password = decoded.split(':')[1];

  dockerLogin(ECR_REGISTRY, password);
  logSuccess('Logged in to private ECR');
}
