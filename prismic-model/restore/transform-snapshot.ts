/**
 * transform-snapshot.ts
 *
 * Prepares a Prismic content snapshot for import. Must always be run after
 * (or in lieu of) restore-prismic-assets, and before restore-prismic-content.
 *
 * Transformations applied:
 *   - Rewrites old asset IDs to new IDs using asset-id-map.json
 *   - Rewrites old content document IDs to new IDs using content-id-map.json
 *   - Corrects asset URL path segments using asset-slug-map.json
 *   - Backfills publishDate on articles from first_publication_date
 *   - Optionally rewrites the repository name in Prismic asset URLs
 *
 * Replacements that could collide with existing values are applied using a
 * two-pass placeholder strategy:
 *
 *   1. Replace every matched value with "<newValue>__RESTORE_PLACEHOLDER__"
 *   2. Strip the "__RESTORE_PLACEHOLDER__" suffix from every replaced value
 *
 * If --source-repo and --target-repo are both provided (and differ), a final pass rewrites
 * the repository name wherever it appears in Prismic asset URLs.
 *
 * The result is written to a new file; the original snapshot is not modified.
 *
 * Usage:
 *   yarn transformSnapshot \
 *     [--snapshot <path>] [--out <path>] \
 *     [--source-repo <name>] [--target-repo <name>]
 *
 * Defaults:
 *   --snapshot  Latest file in ./restore/snapshot/; if not found locally, downloads from S3
 *   --out       ./restore/snapshot/prismic-snapshot-rewritten.json (fixed; always overwritten)
 *
 * When using Scenario 2 (no assets to restore), PRISMIC_S3_BUCKET must be set in .env
 * so the script can download the snapshot. When using Scenario 1, provide --snapshot
 * directly or ensure a snapshot exists in ./restore/snapshot/ (may already be downloaded
 * by restore-prismic-assets.ts).
 *
 * Two-stage workflow for content relationship fields:
 *   1. First run (before content uploaded): only asset IDs are rewritten
 *   2. After first content upload: content-id-map.json is created
 *   3. Second run: both asset and content IDs are rewritten
 *   4. Second content upload: content relationships now reference correct IDs
 */
import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';

import { logError, logInfo, logSuccess } from '@weco/common/utils/console-logs';
import {
  escapeRegex,
  readJsonFile,
} from '@weco/prismic-model/restore/restore-utils';

import 'dotenv/config';
import {
  downloadLatestSnapshot,
  REWRITTEN_SNAPSHOT_FILENAME,
} from './s3-utils';

// ---------------------------------------------------------------------------
// CLI arguments
// ---------------------------------------------------------------------------

const argv = yargs(process.argv.slice(2))
  .usage(
    'Usage: $0 [--snapshot <path>] [--out <path>] [--source-repo <name>] [--target-repo <name>]'
  )
  .options({
    snapshot: {
      type: 'string',
      description: 'Path to the source snapshot JSON file',
    },
    out: {
      type: 'string',
      description:
        'Override the output path. Defaults to ./restore/snapshot/prismic-snapshot-rewritten.json (always overwritten).',
    },
    'source-repo': {
      type: 'string',
      description:
        'Source Prismic repository name (e.g. wellcomecollection). Required for URL rewriting.',
    },
    'target-repo': {
      type: 'string',
      description:
        'Target Prismic repository name to replace the source name with in asset URLs.',
    },
  })
  .parseSync();

// ---------------------------------------------------------------------------
// Resolve paths
// ---------------------------------------------------------------------------

const SNAPSHOT_DIR = path.resolve('./restore/snapshot/');
const DEFAULT_ASSET_MAP = path.resolve('./restore/status/asset-id-map.json');
const DEFAULT_CONTENT_MAP = path.resolve(
  './restore/status/content-id-map.json'
);
const DEFAULT_SLUG_MAP = path.resolve('./restore/status/asset-slug-map.json');

// PRISMIC_S3_BUCKET is only required when no local snapshot exists
const BUCKET = process.env.PRISMIC_S3_BUCKET;
const bucket: string = BUCKET ?? '';

async function resolveSnapshotPath(): Promise<string> {
  if (argv.snapshot) return path.resolve(argv.snapshot);

  // Try to find an existing snapshot locally
  if (fs.existsSync(SNAPSHOT_DIR)) {
    const files = fs
      .readdirSync(SNAPSHOT_DIR)
      .filter(f => f.endsWith('.json') && f !== REWRITTEN_SNAPSHOT_FILENAME)
      .map(f => ({
        name: f,
        mtime: fs.statSync(path.join(SNAPSHOT_DIR, f)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > 0) {
      return path.join(SNAPSHOT_DIR, files[0].name);
    }
  }

  // No local snapshot found; try to download from S3 (needed for Scenario 2)
  if (!bucket) {
    throw new Error(
      `No source snapshot found in ${SNAPSHOT_DIR} and PRISMIC_S3_BUCKET environment variable is not set. ` +
        `Either: provide --snapshot, or set PRISMIC_S3_BUCKET to download the latest snapshot from S3.`
    );
  }

  console.log('No local snapshot found; downloading latest from S3...');
  return downloadLatestSnapshot(bucket);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function init() {
  // Step 1: Resolve input paths (may download from S3 if needed)
  const snapshotPath = await resolveSnapshotPath();
  const assetMapPath = DEFAULT_ASSET_MAP;
  const contentMapPath = DEFAULT_CONTENT_MAP;

  // The asset ID map may not exist when no assets were re-uploaded (Scenario 2).
  // The content ID map may not exist before the first content upload.
  // The script will apply whichever transformations have their required maps available.
  const assetMapExists = fs.existsSync(assetMapPath);
  const contentMapExists = fs.existsSync(contentMapPath);

  if (!assetMapExists) {
    logInfo(
      `Asset ID map not found at ${assetMapPath} — skipping asset ID rewriting.`
    );
  }
  if (!contentMapExists) {
    logInfo(
      `Content ID map not found at ${contentMapPath} — skipping content ID rewriting.`
    );
  }

  // Always write to a fixed filename so there is only ever one rewritten snapshot.
  // The --out flag can override this if needed.
  const defaultOut = path.join(SNAPSHOT_DIR, REWRITTEN_SNAPSHOT_FILENAME);
  const outPath = argv.out ? path.resolve(argv.out) : defaultOut;

  logInfo(`Source snapshot : ${snapshotPath}`);
  logInfo(`Asset ID map    : ${assetMapExists ? assetMapPath : '(none)'}`);
  logInfo(`Content ID map  : ${contentMapExists ? contentMapPath : '(none)'}`);
  logInfo(`Output path     : ${outPath}`);

  const sourceRepo = argv.sourceRepo;
  const targetRepo = argv.targetRepo;
  const rewriteUrls = sourceRepo && targetRepo && sourceRepo !== targetRepo;
  if (rewriteUrls) {
    logInfo(`Repo name rewrite: "${sourceRepo}" → "${targetRepo}"`);
  }

  // Step 2: Load inputs
  const assetIdMap: Record<string, string> = assetMapExists
    ? readJsonFile<Record<string, string>>(assetMapPath)
    : {};
  const oldAssetIds = Object.keys(assetIdMap);

  const contentIdMap: Record<string, string> = contentMapExists
    ? readJsonFile<Record<string, string>>(contentMapPath)
    : {};
  const oldContentIds = Object.keys(contentIdMap);

  // Load the URL slug map if it exists (produced by restore-prismic-assets.ts).
  // Maps old URL path segments (e.g. "oldId_originalFile.jpg") to new path segments.
  // When present this gives exact URL replacements; when absent we fall back to
  // ID-only replacement which handles the id portion but not the filename slug.
  const slugMap: Record<string, string> = fs.existsSync(DEFAULT_SLUG_MAP)
    ? readJsonFile<Record<string, string>>(DEFAULT_SLUG_MAP)
    : {};
  const oldSlugs = Object.keys(slugMap);
  if (oldSlugs.length > 0) {
    logInfo(
      `Loaded ${oldSlugs.length} URL slug mappings from ${DEFAULT_SLUG_MAP}`
    );
  }

  // Read the snapshot as a raw string so we can do text-level ID/URL replacements
  // before any later JSON.parse/JSON.stringify steps (for example publishDate
  // backfilling) re-stringify and normalise the final output.
  let content = fs.readFileSync(snapshotPath, 'utf-8');

  // Step 3/4: text-level replacement passes. We run slug replacements first because
  // slug-map keys include the original asset ID. If ID replacement ran first, many
  // slug keys would no longer match and filename slug correction would be skipped.
  const PLACEHOLDER = '__RESTORE_PLACEHOLDER__';

  // Pass 1/2 (optional): replace full URL path segments using the slug map.
  // This corrects the filename portion of asset URLs which may differ from the source
  // because Prismic URL-sanitises filenames at upload time (spaces stripped, chars encoded).
  // Uses a two-pass placeholder strategy to prevent collision.
  if (oldSlugs.length > 0) {
    const escapedSlugs = oldSlugs.map(escapeRegex);
    // Regex: (slug1|slug2|slug3|...) - matches any old URL path segment globally
    const pass3Re = new RegExp(escapedSlugs.join('|'), 'g');
    let pass3Replacements = 0;
    content = content.replace(pass3Re, match => {
      pass3Replacements++;
      return `${slugMap[match]}${PLACEHOLDER}`;
    });
    let pass4Count = 0;
    // Regex: matches the placeholder suffix to remove it
    content = content.replace(new RegExp(PLACEHOLDER, 'g'), () => {
      pass4Count++;
      return '';
    });
    logSuccess(
      `Pass 1/2 complete: replaced ${pass3Replacements} URL path segments (${pass4Count} cleaned up)`
    );
  }

  // Pass 3/4: replace old asset IDs with new ones (skipped if no map).
  // Two-pass placeholder strategy guards against the case where a new ID equals an old one.
  if (oldAssetIds.length > 0) {
    const escapedIds = oldAssetIds.map(escapeRegex);
    // Regex: (id1|id2|id3|...) - matches any old asset ID globally
    const pass3Re = new RegExp(escapedIds.join('|'), 'g');
    let pass3Replacements = 0;
    content = content.replace(pass3Re, match => {
      pass3Replacements++;
      return `${assetIdMap[match]}${PLACEHOLDER}`;
    });
    let pass4Count = 0;
    // Regex: matches the placeholder suffix to remove it
    content = content.replace(new RegExp(PLACEHOLDER, 'g'), () => {
      pass4Count++;
      return '';
    });
    logSuccess(
      `Pass 3/4 complete: replaced ${pass3Replacements} asset IDs (${pass4Count} cleaned up)`
    );
  }

  // Pass 5/6: replace old content document IDs with new ones (skipped if no map).
  // This corrects content relationship fields that reference other documents.
  // Two-pass placeholder strategy guards against the case where a new ID equals an old one.
  if (oldContentIds.length > 0) {
    const escapedIds = oldContentIds.map(escapeRegex);
    // Regex: (id1|id2|id3|...) - matches any old content document ID globally
    const pass5Re = new RegExp(escapedIds.join('|'), 'g');
    let pass5Replacements = 0;
    content = content.replace(pass5Re, match => {
      pass5Replacements++;
      return `${contentIdMap[match]}${PLACEHOLDER}`;
    });
    let pass6Count = 0;
    // Regex: matches the placeholder suffix to remove it
    content = content.replace(new RegExp(PLACEHOLDER, 'g'), () => {
      pass6Count++;
      return '';
    });
    logSuccess(
      `Pass 5/6 complete: replaced ${pass5Replacements} content document IDs (${pass6Count} cleaned up)`
    );
  }
  // Prismic embeds the repo name in two URL patterns:
  //   https://images.prismic.io/<repo>/...
  //   https://<repo>.cdn.prismic.io/<repo>/...
  // Both must be updated when restoring to a repository with a different name.
  if (rewriteUrls) {
    const escapedSource = escapeRegex(sourceRepo!);

    // Regex: (https://images\.prismic\.io/)<repo>(/?) - matches images.prismic.io URLs
    // Capture groups: $1=prefix, $2=optional trailing slash
    const imagesRe = new RegExp(
      `(https://images\\.prismic\\.io/)${escapedSource}(/?)`,
      'g'
    );
    let imagesCount = 0;
    content = content.replace(imagesRe, (_, prefix, slash) => {
      imagesCount++;
      return `${prefix}${targetRepo}${slash}`;
    });

    // Regex: https://<repo>(\.cdn\.prismic\.io/)<repo>(/) - matches cdn.prismic.io URLs
    // Capture groups: $1=middle domain part, $2=trailing slash
    const cdnRe = new RegExp(
      `https://${escapedSource}(\\.cdn\\.prismic\\.io/)${escapedSource}(/)`,
      'g'
    );
    let cdnCount = 0;
    content = content.replace(cdnRe, (_, middle, slash) => {
      cdnCount++;
      return `https://${targetRepo}${middle}${targetRepo}${slash}`;
    });

    logSuccess(
      `Pass 7 complete: rewrote ${imagesCount} images.prismic.io URLs and ${cdnCount} cdn.prismic.io URLs`
    );
  }
  // Step 8: Backfill publishDate on articles
  // Articles restored to a new repo receive a new first_publication_date, so we
  // preserve the original publication date by setting publishDate from
  // first_publication_date whenever it is absent. This keeps list-page ordering
  // correct in the Content API.
  // publishDate is a Prismic Timestamp field, so the full ISO string is used as-is.
  const docs: unknown[] = JSON.parse(content);
  let publishDateCount = 0;
  for (const doc of docs) {
    const d = doc as Record<string, unknown>;
    const data =
      d.data && typeof d.data === 'object'
        ? (d.data as Record<string, unknown>)
        : null;
    if (
      d.type === 'articles' &&
      !data?.publishDate &&
      d.first_publication_date
    ) {
      if (!data) {
        d.data = {};
      }
      (d.data as Record<string, unknown>).publishDate =
        d.first_publication_date;
      publishDateCount++;
    }
  }
  content = JSON.stringify(docs, null, 2);
  logSuccess(
    `Pass publishDate: backfilled publishDate on ${publishDateCount} articles`
  );

  // Step 9: Validate the result is still valid JSON before writing
  try {
    JSON.parse(content);
  } catch (err) {
    throw new Error(
      `Rewritten content is not valid JSON — aborting before writing.`,
      { cause: err }
    );
  }

  // Step 10: Write the output file
  fs.writeFileSync(outPath, content, 'utf-8');
  logSuccess(`Rewritten snapshot written to ${outPath}`);
  logInfo(
    'You can now pass this file to restore-prismic-content.ts via --snapshot.'
  );
}

try {
  init();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Error transforming snapshot: ${message}`);
  process.exit(1);
}
