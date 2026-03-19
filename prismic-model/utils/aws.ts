import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

import {
  AccountName,
  AwsAccess,
  awsAccounts,
} from '@weco/common/data/aws-accounts';

export type { AccountName };

const stsClient = new STSClient({ region: 'eu-west-1' });

export async function getCreds(
  name: AccountName,
  access: AwsAccess = 'read_only'
) {
  const command = new AssumeRoleCommand({
    RoleArn: `arn:aws:iam::${awsAccounts[name].account}:role/${name}-${access}`,
    RoleSessionName: `${name}-${access}`,
  });

  const data = await stsClient.send(command);

  return {
    accessKeyId: data.Credentials!.AccessKeyId!,
    secretAccessKey: data.Credentials!.SecretAccessKey!,
    sessionToken: data.Credentials!.SessionToken!,
  };
}

export type Credentials = Awaited<ReturnType<typeof getCreds>>;

export async function setEnvsFromSecrets(
  secrets: Record<string, string>,
  credentials?: Credentials
): Promise<void> {
  const secretsManagerClient = new SecretsManagerClient({
    credentials,
    region: 'eu-west-1',
  });

  const responses = await Promise.all(
    Object.values(secrets).map(secretId =>
      secretsManagerClient.send(
        new GetSecretValueCommand({ SecretId: secretId })
      )
    )
  );

  const envs = Object.keys(secrets).map((env, i) => [
    env,
    responses[i].SecretString,
  ]);

  for (const [env, val] of envs) {
    if (env) {
      process.env[env] = val;
    }
  }
}
