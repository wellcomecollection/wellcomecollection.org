import { ECRClient, GetAuthorizationTokenCommand } from '@aws-sdk/client-ecr';
import {
  ECRPUBLICClient,
  GetAuthorizationTokenCommand as GetPublicAuthTokenCommand,
} from '@aws-sdk/client-ecr-public';
import type { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { execFileSync } from 'child_process';

import {
  ECR_PUBLIC_REGION,
  ECR_PUBLIC_REGISTRY,
  ECR_REGION,
  ECR_REGISTRY,
} from './config';
import { logInfo, logSuccess } from './logger';

function dockerLogin(registry: string, password: string): void {
  execFileSync(
    'docker',
    ['login', '--username', 'AWS', '--password-stdin', registry],
    { input: password, stdio: ['pipe', 'pipe', 'pipe'] }
  );
}

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
