import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export async function generatePresignedUrl(
  bucket: string,
  key: string,
  region = 'eu-west-1',
  expiresIn = 3600
): Promise<string> {
  const s3Client = new S3Client({ region });

  return getSignedUrl(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    s3Client as any, // bypasses the type mismatch caused by conflicting @smithy/smithy-client versions, avoids the complexity of forcing smithy versions across a large monorepo that could break other things.
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn }
  );
}

export interface DownloadLatestS3FileParams {
  bucket: string;
  prefix: string;
  region?: string;
  outputDir: string;
  filter?: (obj: { Key?: string; LastModified?: Date }) => boolean;
}

/**
 * Downloads the latest file from S3 matching the prefix and saves it to outputDir.
 * Returns the local file path.
 * Removes old files in outputDir matching the prefix that are not the latest to avoid confusion.
 * If the latest file already exists in outputDir, it skips downloading and returns the existing file path.
 */
export async function downloadLatestS3File({
  bucket,
  prefix,
  region = 'eu-west-1',
  outputDir,
}: DownloadLatestS3FileParams): Promise<string> {
  const s3Client = new S3Client({ region });

  const listResponse = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix })
  );

  const objects = (listResponse.Contents ?? []).filter(
    obj => obj.Key && obj.Key.startsWith(prefix)
  );

  if (objects.length === 0) {
    throw new Error(
      `No files found in S3 bucket ${bucket} with prefix ${prefix}`
    );
  }

  // Sort by LastModified descending and take the most recent
  const latest = objects.sort(
    (a, b) =>
      (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0)
  )[0];

  if (!latest?.Key) {
    throw new Error('Could not determine latest file');
  }

  const fileName = path.basename(latest.Key);
  const outputPath = path.join(outputDir, fileName);

  // Always remove old files matching the current prefix that are not the latest
  const prefixBase = path.basename(prefix).replace(/[-_]+$/, '');
  const files = fs.readdirSync(outputDir);
  for (const file of files) {
    if (file.startsWith(prefixBase) && file !== fileName) {
      const oldPath = path.join(outputDir, file);
      fs.unlinkSync(oldPath);
      console.log(`Removed old file: ${oldPath}`);
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(outputPath)) {
    console.log(
      `Latest file already exists at ${outputPath}, skipping download`
    );
    return outputPath;
  }

  console.log(`Downloading latest file: ${latest.Key}`);

  const getResponse = await s3Client.send(
    new GetObjectCommand({ Bucket: bucket, Key: latest.Key })
  );

  const bodyStream = getResponse.Body as Readable;

  await pipeline(bodyStream, fs.createWriteStream(outputPath));

  console.log(`File saved to ${outputPath}`);
  return outputPath;
}
