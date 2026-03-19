/**
 * restore-prismic-assets.ts
 *
 * This script restores media library assets, backed up to S3, to a target Prismic repository.
 * It works by:
 *   1. Downloading the latest backup Prismic assets manifest and content snapshot from S3.
 *   2. Determining which asset IDs are actually referenced in the snapshot (used assets).
 *   3. Fetching the list of asset IDs already in the target Prismic repository.
 *   4. Uploading only the missing used assets via the Prismic Asset API,
 *      fetching file bytes from S3 with AWS credentials and posting multipart/form-data.
 *   5. Tracking old → new asset ID mappings in asset-id-map.json so:
 *    1) the script can be safely resumed if interrupted without creating duplicates, and
 *      2) we can update the asset ids in the content snapshot file before restoring the content
 *   6. Recording any failed uploads to asset-upload-failed.json for retry.
 *
 * Required environment variables (set in .env):
 *   PRISMIC_S3_BUCKET        - S3 bucket containing the backups
 *   PRISMIC_REPO             - Target Prismic repository name
 *   PRISMIC_WRITE_API_TOKEN  - Prismic write API token for the target repository
 */
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import * as readline from 'readline';
import { Readable } from 'stream';

import { downloadLatestS3File, downloadLatestSnapshot } from './s3-utils';
import 'dotenv/config';

const bucketFromEnv = process.env.PRISMIC_S3_BUCKET;
if (!bucketFromEnv)
  throw new Error('PRISMIC_S3_BUCKET environment variable is required');
const bucket = bucketFromEnv;
const s3Client = new S3Client({ region: 'eu-west-1' });

// S3 key prefixes for the two backup types, and local directories to download them into
const ASSETS_PREFIX = 'media-library/prismic-assets-';
const ASSETS_OUTPUT_DIR = './restore/assets/';

// Downloads the most recent assets manifest JSON from S3 (prismic-assets-*.json).
// This file contains metadata for every asset in the Prismic media library.
async function downloadLatestAssetsList(): Promise<string> {
  console.log('Downloading latest assets list from S3...');
  return downloadLatestS3File({
    bucket,
    prefix: ASSETS_PREFIX,
    region: 'eu-west-1',
    outputDir: path.resolve(ASSETS_OUTPUT_DIR),
  });
}

// Cross-references the full assets manifest against the content snapshot to find
// only the asset IDs that are actually referenced in published content.
// Writes the filtered list to used-assets.json to avoid uploading unused assets.
function writeUsedAssetIds({
  assetsPath,
  snapshotPath,
  outputFile,
}: {
  assetsPath: string;
  snapshotPath: string;
  outputFile: string;
}) {
  console.log('Determining which assets are being used...');
  const resolvedAssetsPath = path.resolve(assetsPath);
  const resolvedSnapshotPath = path.resolve(snapshotPath);
  const resolvedOutputFile = path.resolve(outputFile);
  const assets = JSON.parse(fs.readFileSync(resolvedAssetsPath, 'utf8'));
  const snapshotDocs = JSON.parse(
    fs.readFileSync(resolvedSnapshotPath, 'utf8')
  );
  // Recursively collect all string values from snapshot
  function collectStrings(obj: unknown, set: Set<string>) {
    if (typeof obj === 'string') {
      set.add(obj);
    } else if (Array.isArray(obj)) {
      for (const item of obj) collectStrings(item, set);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) collectStrings(obj[key], set);
    }
  }
  // Ensure output directory exists
  const outputDir = path.dirname(resolvedOutputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const snapshotStrings = new Set<string>();
  for (const doc of snapshotDocs) {
    // Remove top-level id from doc before collecting strings, we know we don't want to match asset IDs against document IDs
    const { id, ...rest } = doc;
    collectStrings(rest, snapshotStrings);
  }
  const usedAssetIds = assets
    .filter(asset => snapshotStrings.has(asset.id))
    .map(asset => asset.id);
  fs.writeFileSync(resolvedOutputFile, JSON.stringify(usedAssetIds, null, 2));
  const total = assets.length;
  const used = usedAssetIds.length;
  const percent = ((used / total) * 100).toFixed(2);
  console.log(`Wrote ${used} used asset ids to ${resolvedOutputFile}`);
  console.log(`Used assets: ${used}/${total} (${percent}%)`);
}

// Reads the target Prismic repository name from env
function getRepositoryName(): string {
  const repository = process.env.PRISMIC_REPO;
  if (!repository)
    throw new Error('PRISMIC_REPO environment variable is required');
  return repository;
}

// Reads the Prismic write API token from env
function getWriteApiToken(): string {
  const token = process.env.PRISMIC_WRITE_API_TOKEN;
  if (!token)
    throw new Error('PRISMIC_WRITE_API_TOKEN environment variable is required');
  return token;
}

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}
// Paginates through the Prismic Asset API to fetch IDs of all assets already
// present in the target repo. Only useful when restoring to the same repo where source and target
// asset IDs match. For cross-repo restores, assets get new IDs so this check is a no-op —
// duplicate prevention is handled by asset-id-map.json instead.
async function fetchAllTargetRepoAssets(
  token: string,
  repository: string
): Promise<string[]> {
  const assetsUrlBase = 'https://asset-api.prismic.io/assets';
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allIds: string[] = [];
  let cursor: string | undefined;
  const pageSize = 5000;
  let isLastPage = false;

  console.log(`Fetching existing assets from target repo "${repository}"...`);

  while (!isLastPage) {
    const url = new URL(assetsUrlBase);
    url.searchParams.set('limit', pageSize.toString());
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        repository,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch assets from target repo: ${res.status} ${res.statusText}`
      );
    }

    const json = (await res.json()) as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const items: { id: string }[] = Array.isArray(json.items) ? json.items : [];
    for (const item of items) {
      if (item.id) allIds.push(item.id);
    }

    console.log(
      `Fetched ${items.length} assets (total so far: ${allIds.length})`
    );

    isLastPage = items.length < pageSize;
    cursor = json.cursor;

    if (!isLastPage) await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`Found ${allIds.length} existing assets in target repo`);
  return allIds;
}

// Uploads a single asset to the Prismic Asset API.
// Downloads source bytes from either a direct URL or S3 using current AWS credentials,
// then uploads to Prismic as multipart/form-data with optional metadata.
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function fetchAssetBinary(
  s3Bucket: string,
  s3KeyOrUrl: string,
  assetId: string
): Promise<Buffer> {
  if (/^https?:\/\//i.test(s3KeyOrUrl)) {
    const fileResponse = await fetch(s3KeyOrUrl);
    if (!fileResponse.ok) {
      throw new Error(
        `Failed to download source file for asset ${assetId}: ${fileResponse.status} ${fileResponse.statusText}`
      );
    }
    return fileResponse.buffer();
  }

  const s3UrlMatch = /^s3:\/\/([^/]+)\/(.+)$/.exec(s3KeyOrUrl);
  const sourceBucket = s3UrlMatch?.[1] ?? s3Bucket;
  const sourceKey = (s3UrlMatch?.[2] ?? s3KeyOrUrl).replace(/^\/+/, '');

  const getResponse = await s3Client.send(
    new GetObjectCommand({ Bucket: sourceBucket, Key: sourceKey })
  );
  const bodyStream = getResponse.Body as Readable | undefined;
  if (!bodyStream) {
    throw new Error(`No file body returned for asset ${assetId}`);
  }

  return streamToBuffer(bodyStream);
}

async function uploadAsset(
  asset: {
    id: string;
    s3Key: string;
    filename: string;
    notes?: string;
    credits?: string;
    alt?: string;
  },
  token: string,
  repository: string
): Promise<string | null> {
  let fileBuffer: Buffer;
  try {
    fileBuffer = await fetchAssetBinary(bucket, asset.s3Key, asset.id);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (/credentials|ExpiredToken|token expired/i.test(msg)) {
      console.error(
        'AWS credentials expired. Re-authenticate and re-run — previous progress is saved.'
      );
      process.exit(1);
    }
    console.error(error);
    return null;
  }

  const formData = new FormData();
  formData.append('file', fileBuffer, { filename: asset.filename });

  const notes = asset.notes?.trim();
  const credits = asset.credits?.trim();
  const alt = asset.alt?.trim();

  if (notes) formData.append('notes', notes);
  if (credits) formData.append('credits', credits);
  if (alt) formData.append('alt', alt);

  const response = await fetch(`https://asset-api.prismic.io/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      repository,
      Accept: 'application/json',
      ...formData.getHeaders(),
    },
    body: formData,
  });
  if (!response.ok) {
    console.error(
      `Failed to upload asset ${asset.id}: ${response.status} ${response.statusText}`
    );
    return null;
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const result = (await response.json()) as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return result.id ?? null;
}

async function init() {
  const repository = getRepositoryName();
  const token = getWriteApiToken();

  // Step 1: Download the latest snapshot and assets manifest from S3
  const latestSnapshotPath = await downloadLatestSnapshot(bucket);
  const latestAssetsPath = await downloadLatestAssetsList();

  // Status files track progress and allow the script to be safely resumed
  const statusDir = './restore/status/';
  const usedAssetsFile = path.join(statusDir, 'used-assets.json'); // assets referenced in the snapshot
  const existingAssetsFile = path.join(statusDir, 'existing-assets.json'); // assets already in the target repository
  const assetIdMapFile = path.join(statusDir, 'asset-id-map.json'); // old id -> new id mappings from uploads
  const failedAssetsFile = path.join(statusDir, 'asset-upload-failed.json'); // ids that failed to upload

  // Ensure status directory exists
  if (!fs.existsSync(statusDir)) {
    fs.mkdirSync(statusDir, { recursive: true });
  }

  // Step 2: Determine which assets are actually referenced in the snapshot
  writeUsedAssetIds({
    assetsPath: latestAssetsPath,
    snapshotPath: latestSnapshotPath,
    outputFile: usedAssetsFile,
  });

  // Step 3: Fetch and save the list of assets already in the target repo.
  // Only effective when restoring to the same repo (source IDs match target IDs).
  // For cross-repo restores, uploaded assets get new IDs so this set won't match source IDs;
  // in that case, asset-id-map.json is the authoritative guard against duplicates.
  const existingAssetIds = await fetchAllTargetRepoAssets(token, repository);
  fs.writeFileSync(
    existingAssetsFile,
    JSON.stringify(existingAssetIds, null, 2)
  );
  console.log(
    `Wrote ${existingAssetIds.length} existing asset IDs to ${existingAssetsFile}`
  );
  const existingAssetIdSet = new Set(existingAssetIds);

  // Build the list of used assets that need to be uploaded
  const usedAssetIds: string[] = JSON.parse(
    fs.readFileSync(usedAssetsFile, 'utf-8')
  );
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allAssets: any[] = JSON.parse(
    fs.readFileSync(latestAssetsPath, 'utf-8')
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const usedAssets = allAssets.filter(a => usedAssetIds.includes(a.id));

  // Step 4: Confirm with the user before uploading
  const proceed = await confirm(
    `You are about to upload ${usedAssets.length} assets to "${repository}". Do you wish to proceed? (y/N) `
  );

  if (!proceed) {
    console.log('Aborted');
    process.exit(0);
  }

  // Load the ID map from any previous run so we can resume without re-uploading
  const idMap: Record<string, string> = fs.existsSync(assetIdMapFile)
    ? JSON.parse(fs.readFileSync(assetIdMapFile, 'utf-8'))
    : {};

  if (Object.keys(idMap).length > 0) {
    console.log(
      `Loaded ${Object.keys(idMap).length} existing asset ID mappings`
    );
  }

  const failedAssetIds: string[] = [];

  // Step 5: Upload each missing asset, writing progress as we go
  for (const asset of usedAssets) {
    // Skip if already present in the target repo with the same ID (same-repo restore only)
    if (existingAssetIdSet.has(asset.id)) {
      console.log(`Asset ${asset.id} already exists in target repo, skipping`);
      continue;
    }
    // Skip if already uploaded in a previous run of this script (cross-repo restore resume)
    if (idMap[asset.id]) {
      console.log(`Skipping already uploaded asset ${asset.id}`);
      continue;
    }
    const newId = await uploadAsset(
      {
        id: asset.id,
        s3Key: asset.origin?.url ?? asset.url,
        filename: (
          asset.name ??
          asset.filename ??
          `${asset.id}.${asset.extension ?? 'bin'}`
        ).trim(),
        notes: asset.notes,
        credits: asset.credits,
        alt: asset.alt,
      },
      token,
      repository
    );
    if (newId) {
      // Persist the mapping immediately so progress is saved on each upload
      idMap[asset.id] = newId;
      fs.writeFileSync(assetIdMapFile, JSON.stringify(idMap, null, 2));
      console.log(`Uploaded asset ${asset.id} -> ${newId}`);
    } else {
      // Record failures immediately so they can be retried separately
      failedAssetIds.push(asset.id);
      fs.writeFileSync(
        failedAssetsFile,
        JSON.stringify(failedAssetIds, null, 2)
      );
    }
  }

  if (failedAssetIds.length > 0) {
    console.log(
      `${failedAssetIds.length} assets failed to upload. See ${failedAssetsFile}`
    );
  }
  console.log(`Done. Asset ID map saved to ${assetIdMapFile}`);
}

init().catch(error => {
  console.error('Error downloading latest assets list:', error);
  process.exit(1);
});
