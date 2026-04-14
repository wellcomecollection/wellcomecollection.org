import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const SNAPSHOT_PREFIX = 'snapshots/prismic-snapshot-';
const SNAPSHOT_OUTPUT_DIR = path.resolve('./restore/snapshot/');
// Fixed output filename produced by transform-snapshot.ts — exported so that script
// can import from one place rather than maintaining a duplicate constant.
export const REWRITTEN_SNAPSHOT_FILENAME = 'prismic-snapshot-rewritten.json';

export type DownloadLatestS3FileParams = {
  bucket: string;
  prefix: string;
  region?: string;
  outputDir: string;
};

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

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Always remove old files matching the current prefix that are not the latest.
  // Explicitly skip REWRITTEN_SNAPSHOT_FILENAME as an extra guard since it shares
  // the same prefix.
  const prefixBase = path.basename(prefix);
  const files = fs.readdirSync(outputDir);
  for (const file of files) {
    if (
      file.startsWith(prefixBase) &&
      file !== fileName &&
      file !== REWRITTEN_SNAPSHOT_FILENAME
    ) {
      const oldPath = path.join(outputDir, file);
      fs.unlinkSync(oldPath);
      console.log(`Removed old file: ${oldPath}`);
    }
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

/**
 * Downloads the latest Prismic content snapshot from S3.
 * Shared between restore-prismic-assets and restore-prismic-content.
 */
export async function downloadLatestSnapshot(bucket: string): Promise<string> {
  console.log('Downloading latest snapshot from S3...');
  return downloadLatestS3File({
    bucket,
    prefix: SNAPSHOT_PREFIX,
    region: 'eu-west-1',
    outputDir: SNAPSHOT_OUTPUT_DIR,
  });
}
