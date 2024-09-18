import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

import { getCreds } from '@weco/ts-aws';

import { TogglesResp } from '.';
import { bucket, key, region } from './config';

// see: https://github.com/aws/aws-sdk-js-v3/issues/1877
async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

export async function getTogglesObject(client: S3Client): Promise<TogglesResp> {
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

export async function putTogglesObject(
  s3Client: S3Client,
  obj: TogglesResp
): Promise<PutObjectCommandOutput> {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: `${key}`,
    Body: JSON.stringify(obj),
    ACL: 'public-read',
    ContentType: 'application/json',
  });

  const response = await s3Client.send(putObjectCommand);

  // create an invalidation on the object
  const credentials = await getCreds('experience', 'admin');
  const cloudFrontClient = new CloudFrontClient({ region, credentials });
  const command = new CreateInvalidationCommand({
    DistributionId: 'E34PPJX23D6HKG',
    InvalidationBatch: {
      Paths: { Items: [`/${key}`], Quantity: 1 },
      CallerReference: `TogglesInvalidationCallerReference${Date.now()}`,
    },
  });
  const cloudFrontResponse = await cloudFrontClient.send(command);
  console.info(cloudFrontResponse);

  return response;
}
