import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

import {
  AccountName,
  AwsAccess,
  awsAccounts,
} from '@weco/common/data/aws-accounts';
import { region } from '@weco/toggles/config';

const client = new STSClient({ region });

export async function getCreds(
  name: AccountName,
  access: AwsAccess = 'read_only'
) {
  const roleArn = `arn:aws:iam::${awsAccounts[name].account}:role/${name}-${access}`;
  const command = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: `${name}-${access}`,
  });

  const { Credentials } = await client.send(command);
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
