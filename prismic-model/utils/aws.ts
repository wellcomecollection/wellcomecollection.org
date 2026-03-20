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
import { region } from '@weco/prismic-model/config';

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

export type Credentials = Awaited<ReturnType<typeof getCreds>>;

export async function setEnvsFromSecrets(
  secrets: Record<string, string>,
  credentials?: Credentials
): Promise<void> {
  const secretsManagerClient = new SecretsManagerClient({
    credentials,
    region,
  });

  const responses = await Promise.all(
    Object.values(secrets).map(secretId =>
      secretsManagerClient.send(
        new GetSecretValueCommand({ SecretId: secretId })
      )
    )
  );

  const entries = Object.entries(secrets);
  for (let i = 0; i < entries.length; i++) {
    const [env] = entries[i];
    const secretString = responses[i].SecretString;
    if (secretString === undefined) {
      throw new Error(
        `Secret for env var "${env}" did not return a string value.`
      );
    }
    process.env[env] = secretString;
  }
}
