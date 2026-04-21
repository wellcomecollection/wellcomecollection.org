import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

import { region } from '@weco/prismic-model/config';

export const awsAccounts = {
  platform: { account: '760097843905' },
  workflow: { account: '299497370133' },
  storage: { account: '975596993436' },
  experience: { account: '130871440101' },
  data: { account: '964279923020' },
  digitisation: { account: '404315009621' },
  reporting: { account: '269807742353' },
  catalogue: { account: '756629837203' },
  identity: { account: '770700576653' },
} as const;

export type AccountName = keyof typeof awsAccounts;

export type AwsAccess = 'read_only' | 'developer' | 'admin';

const stsClient = new STSClient({ region });

export async function getCreds(
  name: AccountName,
  access: AwsAccess = 'read_only'
) {
  const roleArn = `arn:aws:iam::${awsAccounts[name].account}:role/${name}-${access}`;
  const command = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: `${name}-${access}`,
  });

  const { Credentials } = await stsClient.send(command);
  if (
    !Credentials?.AccessKeyId ||
    !Credentials.SecretAccessKey ||
    !Credentials.SessionToken
  ) {
    throw new Error(
      `Failed to assume role ${roleArn}: missing credentials in STS response`
    );
  }

  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
  };
}

export type AwsCredentials = Awaited<ReturnType<typeof getCreds>>;

export async function setEnvsFromSecrets(
  secrets: Record<string, string>,
  credentials?: AwsCredentials
): Promise<void> {
  const secretsManagerClient = new SecretsManagerClient({
    credentials,
    region,
  });

  const results = await Promise.all(
    Object.entries(secrets).map(async ([env, secretId]) => {
      const response = await secretsManagerClient.send(
        new GetSecretValueCommand({ SecretId: secretId })
      );
      return { env, secretString: response.SecretString };
    })
  );

  for (const { env, secretString } of results) {
    if (secretString === undefined) {
      throw new Error(
        `Secret for env var "${env}" did not return a string value.`
      );
    }
    process.env[env] = secretString;
  }
}
