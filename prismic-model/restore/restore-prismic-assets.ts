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
 *      1) the script can be safely resumed if interrupted without creating duplicates, and
 *      2) we can update the asset ids in the content snapshot file before restoring the content
 *   6. Recording any failed uploads to asset-upload-failed.json for retry.
 *
 * Required environment variables (set in .env):
 *   PRISMIC_S3_BUCKET        - S3 bucket containing the backups
 *   PRISMIC_REPO             - Target Prismic repository name
 *   PRISMIC_WRITE_API_TOKEN  - Prismic write API token for the target repository
 */
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import * as readline from 'readline';
import { Readable } from 'stream';

// Test
import {
  logBanner,
  logError,
  logInfo,
  logSuccess,
} from '@weco/common/utils/console-logs';
import { region } from '@weco/prismic-model/config';
import {
  readJsonFile,
  urlPathSegment,
} from '@weco/prismic-model/restore/restore-utils';
import {
  downloadLatestS3File,
  downloadLatestSnapshot,
} from '@weco/prismic-model/restore/s3-utils';
import 'dotenv/config';

type PrismicAsset = {
  id: string;
  filename?: string;
  extension?: string;
  notes?: string;
  credits?: string;
  alt?: string;
  url?: string;
};

type PrismicAssetsListResponse = {
  items: { id: string }[];
  cursor?: string;
};

type PrismicAssetUploadResponse = {
  id: string;
  url?: string;
};

const bucketFromEnv = process.env.PRISMIC_S3_BUCKET;
if (!bucketFromEnv)
  throw new Error('PRISMIC_S3_BUCKET environment variable is required');
const bucket = bucketFromEnv;
const s3Client = new S3Client({ region });

// S3 key prefixes for the two backup types, and local directories to download them into
const ASSETS_MANIFEST_PREFIX = 'media-library/prismic-assets-';
const ASSETS_OUTPUT_DIR = './restore/assets/';
// S3 prefix where the individual asset files are stored
const ASSETS_PREFIX = 'media-library/assets/';

// Derives the S3 filename for an asset using the same logic as the backup script.
function deriveFilename(asset: PrismicAsset): string {
  if (asset && typeof asset.filename === 'string') {
    const cleanFilename = asset.filename.trim();
    if (cleanFilename) {
      return `${asset.id}-${cleanFilename}`;
    }
  }
  if (asset && typeof asset.extension === 'string') {
    const cleanExtension = asset.extension.trim();
    if (cleanExtension) {
      const ext = cleanExtension.startsWith('.')
        ? cleanExtension
        : `.${cleanExtension}`;
      return `${asset.id}${ext}`;
    }
  }
  return asset.id;
}

// Downloads the most recent assets manifest JSON from S3 (prismic-assets-*.json).
// This file contains metadata for every asset in the Prismic media library.
async function downloadLatestAssetsList(): Promise<string> {
  logInfo('Downloading latest assets list from S3...');
  return downloadLatestS3File({
    bucket,
    prefix: ASSETS_MANIFEST_PREFIX,
    region,
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
  logInfo('Determining which assets are being used...');
  const resolvedAssetsPath = path.resolve(assetsPath);
  const resolvedSnapshotPath = path.resolve(snapshotPath);
  const resolvedOutputFile = path.resolve(outputFile);
  const assets = readJsonFile<PrismicAsset[]>(resolvedAssetsPath);
  const snapshotDocs = readJsonFile<unknown[]>(resolvedSnapshotPath);
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
    const { id, ...rest } = doc as Record<string, unknown>;
    collectStrings(rest, snapshotStrings);
  }
  const usedAssetIds = assets
    .filter(asset => snapshotStrings.has(asset.id))
    .map(asset => asset.id);
  fs.writeFileSync(resolvedOutputFile, JSON.stringify(usedAssetIds, null, 2));
  const total = assets.length;
  const used = usedAssetIds.length;
  const percent = ((used / total) * 100).toFixed(2);
  logSuccess(`Wrote ${used} used asset ids to ${resolvedOutputFile}`);
  logInfo(`Used assets: ${used}/${total} (${percent}%)`);
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
  const allIds: string[] = [];
  let cursor: string | undefined;
  const pageSize = 5000;
  let isLastPage = false;

  logInfo(`Fetching existing assets from target repo "${repository}"...`);

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

    const json = (await res.json()) as PrismicAssetsListResponse;
    const items: { id: string }[] = Array.isArray(json.items) ? json.items : [];
    for (const item of items) {
      if (item.id) allIds.push(item.id);
    }

    logInfo(`Fetched ${items.length} assets (total so far: ${allIds.length})`);

    isLastPage = items.length < pageSize;
    cursor = json.cursor;

    if (!isLastPage) await new Promise(r => setTimeout(r, 1000));
  }

  logSuccess(`Found ${allIds.length} existing assets in target repo`);
  return allIds;
}

// Uploads a single asset to the Prismic Asset API.
// Downloads source bytes from S3 using current AWS credentials,
// then uploads to Prismic as multipart/form-data with optional metadata.

async function fetchAssetStream(
  s3Bucket: string,
  s3Key: string,
  assetId: string
): Promise<Readable> {
  const getResponse = await s3Client.send(
    new GetObjectCommand({ Bucket: s3Bucket, Key: s3Key })
  );
  const bodyStream = getResponse.Body as Readable | undefined;
  if (!bodyStream) {
    throw new Error(`No file body returned for asset ${assetId}`);
  }

  return bodyStream;
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
): Promise<{ id: string; url: string } | null> {
  let fileStream: Readable;
  try {
    fileStream = await fetchAssetStream(bucket, asset.s3Key, asset.id);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (/credentials|ExpiredToken|token expired/i.test(msg)) {
      logError(
        'AWS credentials expired. Re-authenticate and re-run — previous progress is saved.'
      );
      process.exit(1);
    }
    logError(msg);
    return null;
  }

  // form-data properly supports streaming Node.js Readable streams
  const formData = new FormData();
  formData.append('file', fileStream, { filename: asset.filename });

  const notes = asset.notes?.trim();
  const credits = asset.credits?.trim();
  const alt = asset.alt?.trim();

  if (notes) formData.append('notes', notes);
  if (credits) formData.append('credits', credits);
  if (alt) formData.append('alt', alt);

  const response = await fetch('https://asset-api.prismic.io/assets', {
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
    logError(
      `Failed to upload asset ${asset.id}: ${response.status} ${response.statusText}`
    );
    return null;
  }

  const result = (await response.json()) as PrismicAssetUploadResponse;
  if (!result.id) return null;
  return { id: result.id, url: result.url ?? '' };
}

async function init() {
  const repository = getRepositoryName();
  const token = getWriteApiToken();

  // Step 1: Download the latest snapshot and assets manifest from S3
  const latestSnapshotPath = await downloadLatestSnapshot(bucket);
  const latestAssetsPath = await downloadLatestAssetsList();

  // Status files — all written to ./restore/status/
  //
  // Overwritten each run (safe to delete between runs):
  //   used-assets.json       — asset IDs referenced in the snapshot (re-derived each time)
  //   existing-assets.json   — asset IDs already present in the target repo (re-fetched each time)
  //
  // Append-only / resume files (do NOT delete until the full restore is complete):
  //   asset-id-map.json      — old asset ID -> new asset ID; prevents re-uploading on resume
  //   asset-slug-map.json    — old URL path segment -> new URL path segment; used by
  //                            rewrite-snapshot-asset-ids.ts to fix filenames in URLs
  //
  // Written only when uploads fail:
  //   asset-upload-failed.json — IDs that failed to upload; reset each run
  const statusDir = './restore/status/';
  const usedAssetsFile = path.join(statusDir, 'used-assets.json');
  const existingAssetsFile = path.join(statusDir, 'existing-assets.json');
  const assetIdMapFile = path.join(statusDir, 'asset-id-map.json');
  const assetSlugMapFile = path.join(statusDir, 'asset-slug-map.json');
  const failedAssetsFile = path.join(statusDir, 'asset-upload-failed.json');

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
  logSuccess(
    `Wrote ${existingAssetIds.length} existing asset IDs to ${existingAssetsFile}`
  );
  const existingAssetIdSet = new Set(existingAssetIds);

  // Build the list of used assets that need to be uploaded.
  const usedAssetIdSet = new Set<string>(
    readJsonFile<string[]>(usedAssetsFile)
  );
  const allAssets = readJsonFile<PrismicAsset[]>(latestAssetsPath);
  const usedAssets = allAssets.filter(a => usedAssetIdSet.has(a.id));

  // Load the ID map from any previous run so we can resume without re-uploading
  const idMap: Record<string, string> = fs.existsSync(assetIdMapFile)
    ? readJsonFile<Record<string, string>>(assetIdMapFile)
    : {};

  // Load the slug map (old URL path segment -> new URL path segment) from any previous run
  const slugMap: Record<string, string> = fs.existsSync(assetSlugMapFile)
    ? readJsonFile<Record<string, string>>(assetSlugMapFile)
    : {};

  if (Object.keys(idMap).length > 0) {
    logInfo(`Loaded ${Object.keys(idMap).length} existing asset ID mappings`);
  }

  const assetsToUpload = usedAssets.filter(
    a => !existingAssetIdSet.has(a.id) && !idMap[a.id]
  );

  // Step 4: Confirm with the user before uploading
  const proceed = await confirm(
    `You are about to upload ${assetsToUpload.length} assets (of ${usedAssets.length} used) to "${repository}". Do you wish to proceed? (y/N) `
  );

  if (!proceed) {
    logInfo('Aborted');
    process.exit(0);
  }

  const failedAssetIds: string[] = [];

  // Step 5: Upload each missing asset, writing progress as we go
  // Enforce Prismic API rate limit: 1 request per second
  const minIntervalMs = 1000;
  const maxRetries = 3;
  const initialRetryDelayMs = 1000;

  for (const asset of assetsToUpload) {
    const uploadStartTime = Date.now();

    // Remove old id from filename for upload
    let uploadFilename = deriveFilename(asset);
    if (uploadFilename.startsWith(`${asset.id}-`)) {
      uploadFilename = uploadFilename.slice(`${asset.id}-`.length);
    }
    // Prepend previous id to notes
    const notesWithId =
      `previous id: ${asset.id}` + (asset.notes ? `\n${asset.notes}` : '');

    let result: { id: string; url: string } | null = null;
    let retryDelayMs = initialRetryDelayMs;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const uploadResult = await uploadAsset(
        {
          id: asset.id,
          s3Key: `${ASSETS_PREFIX}${deriveFilename(asset)}`,
          filename: uploadFilename,
          notes: notesWithId,
          credits: asset.credits,
          alt: asset.alt,
        },
        token,
        repository
      );

      if (uploadResult) {
        result = uploadResult;
        break;
      }

      if (attempt < maxRetries) {
        logInfo(
          `Upload failed for asset ${asset.id}. Retrying in ${retryDelayMs}ms... (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise(r => setTimeout(r, retryDelayMs));
        retryDelayMs *= 2; // exponential backoff
      }
    }

    if (result) {
      // Persist the ID mapping immediately so progress is saved on each upload
      idMap[asset.id] = result.id;
      fs.writeFileSync(assetIdMapFile, JSON.stringify(idMap, null, 2));

      // Persist the URL slug mapping so rewrite-snapshot-asset-ids can replace
      // the full URL path segment (id_filename) not just the bare ID.
      // The old slug comes from the source asset's URL; the new slug from Prismic's response.
      const oldSlug = urlPathSegment(asset.url ?? '');
      const newSlug = urlPathSegment(result.url);
      if (oldSlug && newSlug) {
        slugMap[oldSlug] = newSlug;
        fs.writeFileSync(assetSlugMapFile, JSON.stringify(slugMap, null, 2));
      }
      logSuccess(`Uploaded asset ${asset.id} -> ${result.id}`);
    } else {
      // Record failures only after all retries exhausted
      logError(
        `Asset ${asset.id} failed after ${maxRetries} attempts. Recording for manual retry.`
      );
      failedAssetIds.push(asset.id);
      fs.writeFileSync(
        failedAssetsFile,
        JSON.stringify(failedAssetIds, null, 2)
      );
    }

    // Respect rate limit by waiting for remaining time in the 1-second interval
    const elapsedMs = Date.now() - uploadStartTime;
    const waitMs = Math.max(0, minIntervalMs - elapsedMs);
    if (waitMs > 0) {
      await new Promise(r => setTimeout(r, waitMs));
    }
  }

  if (failedAssetIds.length > 0) {
    logError(
      `${failedAssetIds.length} assets failed to upload. See ${failedAssetsFile}`
    );
  }
  const uploadedCount = Object.keys(idMap).length;
  const failedCount = failedAssetIds.length;
  const totalUsed = usedAssets.length;
  const remaining = totalUsed - uploadedCount - failedCount;
  logBanner('Summary', 'green');
  logSuccess(`Uploaded: ${uploadedCount}`);
  if (failedCount > 0) {
    logError(`Failed: ${failedCount}`);
  } else {
    logSuccess('Failed: 0');
  }
  logInfo(`Remaining: ${remaining}`);
  logSuccess(`Done. Asset ID map saved to ${assetIdMapFile}`);
}

init().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Error restoring assets: ${message}`);
  process.exit(1);
});
