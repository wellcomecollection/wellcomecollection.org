import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

import {
  AccountName,
  AwsAccess,
  awsAccounts,
} from '@weco/common/data/aws-accounts';

export type { AccountName };

const client = new STSClient({ region: 'eu-west-1' });

export async function getCreds(
  name: AccountName,
  access: AwsAccess = 'read_only'
) {
  const command = new AssumeRoleCommand({
    RoleArn: `arn:aws:iam::${awsAccounts[name].account}:role/${name}-${access}`,
    RoleSessionName: `${name}-${access}`,
  });

  const data = await client.send(command);

  return {
    accessKeyId: data.Credentials!.AccessKeyId!,
    secretAccessKey: data.Credentials!.SecretAccessKey!,
    sessionToken: data.Credentials!.SessionToken!,
  };
}
