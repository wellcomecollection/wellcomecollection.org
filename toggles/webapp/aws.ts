import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { Readable } from 'stream';
import { TogglesResp } from '.';
import { bucket, key, region } from './config';

export async function getCredentials(arn?: string) {
  const stsClient = new STSClient({ region });
  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: arn ?? 'arn:aws:iam::130871440101:role/experience-ci',
    RoleSessionName: 'ExperienceTogglesDeploySession',
  });
  const { Credentials, $metadata: assumeRoleMetadata } = await stsClient.send(
    assumeRoleCommand
  );
  if (!Credentials)
    throw Error(
      `Could not assume role experience-admin with ${assumeRoleMetadata}`
    );

  return {
    accessKeyId: Credentials.AccessKeyId!,
    secretAccessKey: Credentials.SecretAccessKey!,
    expiration: Credentials.Expiration,
    sessionToken: Credentials.SessionToken,
  };
}

export async function getS3Client() {
  const credentials = await getCredentials();
  const s3Client = new S3Client({
    region,
    credentials,
  });

  return s3Client;
}

// see: https://github.com/aws/aws-sdk-js-v3/issues/1877
async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

export async function getTogglesObject(client: S3Client) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const { Body: body } = await client.send(getObjectCommand);

  const toggles: TogglesResp = JSON.parse(
    await streamToString(body as Readable)
  );

  return toggles;
}

export async function putTogglesObject(client: S3Client, obj: TogglesResp) {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: `test-${key}`,
    Body: JSON.stringify(obj),
    ACL: 'public-read',
    ContentType: 'application/json',
  });

  const response = await client.send(putObjectCommand);

  return response;
}
