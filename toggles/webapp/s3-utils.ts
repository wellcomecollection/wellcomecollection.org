import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { TogglesResp } from '.';
import { bucket, key } from './config';

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
    Key: `${key}`,
    Body: JSON.stringify(obj),
    ACL: 'public-read',
    ContentType: 'application/json',
  });

  const response = await client.send(putObjectCommand);

  return response;
}
