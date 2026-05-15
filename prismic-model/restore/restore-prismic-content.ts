/**
 * restore-prismic-content.ts
 *
 * Restores Prismic documents from a content snapshot (backed up to S3) into a target repository
 * using the Prismic Migration API. It is safe to interrupt and re-run — progress is tracked in
 * restore/status/content-id-map.json so already-uploaded documents are not duplicated.
 *
 * Usage:
 *   yarn restorePrismicContent [--snapshot <path>] [--type <customTypeId>]
 *
 * Always run transform-snapshot.ts before this script. The transform script
 * handles asset ID replacement, URL slug correction, and article publishDate
 * backfilling — all of which are needed even when no assets changed.
 *
 *   yarn transformSnapshot [--source-repo <name>] [--target-repo <name>]
 *   yarn restorePrismicContent --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json
 *
 * Pass --type to restore only documents of a specific custom type (e.g. --type pages).
 * Omit it to restore all document types from the snapshot.
 *
 * Required environment variables (set in .env):
 *   PRISMIC_S3_BUCKET        - S3 bucket containing the snapshot backup (only needed when
 *                              --snapshot is omitted and the snapshot must be downloaded)
 *   PRISMIC_REPO             - Target Prismic repository name
 *   PRISMIC_WRITE_API_TOKEN  - Prismic write (Migration) API token for the target repository
 */
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as readline from 'readline';
import yargs from 'yargs';

import { logError, logInfo, logSuccess } from '@weco/common/utils/console-logs';

import { downloadLatestSnapshot } from './s3-utils';

import 'dotenv/config';

// CLI flags
const { type: filterType, snapshot: snapshotArg } = yargs(process.argv.slice(2))
  .usage('Usage: $0 [--snapshot <path>] [--type <customTypeId>]')
  .options({
    snapshot: {
      type: 'string',
      description:
        'Path to the snapshot JSON to restore. Omit to download the latest from S3.',
    },
    type: {
      type: 'string',
      description: 'Only restore documents of this custom type.',
    },
  })
  .parseSync();

// PRISMIC_S3_BUCKET is only required when no --snapshot path is provided
const BUCKET = process.env.PRISMIC_S3_BUCKET;
const bucket: string = BUCKET ?? '';

/* eslint-disable @typescript-eslint/no-explicit-any */

function appendToLog(message: string): void {
  fs.appendFile('restore.log', message, err => {
    if (err) console.error(err);
  });
}

// Searches the target Prismic repository for a document by type + UID.
// Checks every available ref (master and any draft/release refs) so that
// documents created as drafts in a previous run can also be found.
async function findDestinationId(
  repository: string,
  type: string,
  uid: string
): Promise<string | null> {
  const apiResponse = await fetch(
    `https://${repository}.cdn.prismic.io/api/v2`
  );
  if (!apiResponse.ok) {
    throw new Error(
      `Failed to fetch Prismic API for repository "${repository}": HTTP ${apiResponse.status} ${apiResponse.statusText}`
    );
  }
  const api = (await apiResponse.json()) as any;

  // Try all refs (master + any migration/draft releases) to find
  // documents that may have been created as drafts in a previous run
  const refs: string[] = (api.refs ?? []).map((r: any) => r.ref);

  for (const ref of refs) {
    const searchUrl = new URL(
      `https://${repository}.cdn.prismic.io/api/v2/documents/search`
    );
    searchUrl.searchParams.set(
      'q',
      `[[at(document.type,"${type}")][at(document.uid,"${uid}")]]`
    );
    searchUrl.searchParams.set('ref', ref);

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      throw new Error(
        `Failed to search Prismic repository at ref "${ref}": HTTP ${searchResponse.status} ${searchResponse.statusText}`
      );
    }
    const results = (await searchResponse.json()) as any;
    const id = results.results?.[0]?.id;

    if (id) return id;
  }

  return null;
}

// Uploads a single document to the target repository via the Prismic Migration API.
// Strategy:
//   1. If the document was already uploaded in a previous run (present in idMap), issue a PUT
//      to keep it up to date rather than attempting a duplicate POST.
//   2. Otherwise POST to create the document.
//   3. If the POST returns 400/409 (UID conflict), resolve the destination document ID and
//      fall back to a PUT so the document is updated rather than duplicated.
// Returns the new document ID on success, or null on failure.
async function uploadDoc(
  doc: any,
  token: string,
  repository: string,
  idMap: Map<string, string>
): Promise<string | null> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    repository,
  };

  // Migration API requires title to be a string; extract from rich text data
  // field if the top-level title is missing, then fall back to type + uid
  const richTextTitle = doc.data?.title?.[0]?.text;
  const nameTitle = doc.data?.name;

  // Snapshot data can contain legacy/non-conforming interpretation values.
  // Normalize `isPrimary` here to the Migration API's accepted values.
  const interpretations = Array.isArray(doc.data?.interpretations)
    ? doc.data.interpretations.map((item: any) => ({
        ...item,
        isPrimary: item.isPrimary === 'yes' ? 'yes' : null,
      }))
    : undefined;

  // Normalize isPermanent to Migration API's accepted values (yes or null)
  const isPermanent = doc.data?.isPermanent === 'yes' ? 'yes' : null;

  // Normalize times array boolean fields (isFullyBooked, onlineIsFullyBooked)
  const times = Array.isArray(doc.data?.times)
    ? doc.data.times.map((item: any) => ({
        ...item,
        isFullyBooked: item.isFullyBooked === 'yes' ? 'yes' : null,
        onlineIsFullyBooked: item.onlineIsFullyBooked === 'yes' ? 'yes' : null,
      }))
    : undefined;

  const body = {
    ...doc,
    title:
      doc.title ??
      nameTitle ??
      richTextTitle ??
      `${doc.type}${doc.uid ? ` (${doc.uid})` : ''}`,
    data: {
      ...doc.data,
      ...(interpretations && { interpretations }),
      ...(doc.data?.isPermanent !== undefined && { isPermanent }),
      ...(times && { times }),
    },
  };

  // If we already mapped this doc from a previous run, go straight to PUT
  const knownDestinationId = idMap.get(doc.id);
  if (knownDestinationId) {
    const response = await fetch(
      `https://migration.prismic.io/documents/${knownDestinationId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      }
    );
    const result = (await response.json()) as any;
    logInfo(JSON.stringify(result));
    return result.id ?? null;
  }

  // Try POST first (create)
  let response = await fetch('https://migration.prismic.io/documents', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  // If a document with this UID already exists, fall back to PUT (update)
  if (response.status === 400 || response.status === 409) {
    const responseBody = (await response.json()) as any;
    if (
      responseBody?.message === 'A document with this UID already exists' ||
      response.status === 409
    ) {
      // Look up the destination document ID — check the local id map first
      // (from a previous run), then fall back to querying all Prismic refs
      const destinationId =
        idMap.get(doc.id) ??
        (doc.uid
          ? await findDestinationId(repository, doc.type, doc.uid)
          : null);

      if (!destinationId) {
        logError(`Could not find destination ID for ${doc.type} ${doc.uid}`);
        appendToLog(
          `${doc.id}: could not find destination ID for uid "${doc.uid}"\n\n`
        );
        return null;
      }

      response = await fetch(
        `https://migration.prismic.io/documents/${destinationId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        }
      );
    } else {
      // Some other 400 error — log it and return
      logError(`${response.status} ${JSON.stringify(responseBody)}`);
      appendToLog(`${doc.id}: ${JSON.stringify(responseBody)}\n\n`);
      return null;
    }
  }

  try {
    const result = (await response.json()) as any;
    logInfo(JSON.stringify(result));

    if (!result.id) {
      // probably rate limited – log the id so we can manually restore later
      appendToLog(`${doc.id}\n\n`);
      return null;
    }

    return result.id as string;
  } catch (error) {
    const { message } = error as Error;
    appendToLog(`${message}\n\n`);
    logError(message);
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Simple delay helper used to stay within the Migration API's 1 req/sec rate limit
const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Prompts the user for a yes/no answer before proceeding with destructive/slow operations
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

function getRepositoryName(): string {
  const repository = process.env.PRISMIC_REPO;

  if (!repository) {
    throw new Error('PRISMIC_REPO environment variable is required');
  }

  return repository;
}

function getWriteApiToken(): string {
  const token = process.env.PRISMIC_WRITE_API_TOKEN;

  if (!token) {
    throw new Error('PRISMIC_WRITE_API_TOKEN environment variable is required');
  }

  return token;
}

async function init() {
  const repository = getRepositoryName();
  const token = getWriteApiToken();

  // Step 1: Resolve the snapshot to restore from.
  // If --snapshot was provided, use it directly (no S3 download needed).
  // Otherwise download the latest snapshot from S3 — PRISMIC_S3_BUCKET must be set.
  let snapshotPath: string;
  if (snapshotArg) {
    snapshotPath = snapshotArg;
    logInfo(`Using provided snapshot: ${snapshotPath}`);
  } else {
    if (!bucket) {
      throw new Error(
        'PRISMIC_S3_BUCKET environment variable is required when --snapshot is not provided'
      );
    }
    snapshotPath = await downloadLatestSnapshot(bucket);
  }

  logInfo(`Reading snapshot from ${snapshotPath}...`);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const docs: any[] = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
  /* eslint-enable @typescript-eslint/no-explicit-any */
  logInfo(`Loaded ${docs.length} documents`);

  // Step 2: Optionally filter to a single type if --type was passed
  const filteredDocs = filterType
    ? docs.filter((doc: { type: string }) => doc.type === filterType)
    : docs;

  if (filterType) {
    logInfo(
      `Filtering to type "${filterType}": ${filteredDocs.length} documents`
    );
  }

  // Step 3: Confirm with the user before starting the upload
  const totalSeconds = Math.ceil((filteredDocs.length * 1100) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const timeEstimate = hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes}m`;

  const proceed = await confirm(
    `You are about to upload ${filteredDocs.length} documents to "${repository}" (estimated time: ${timeEstimate}). Do you wish to proceed? (y/N) `
  );

  if (!proceed) {
    logInfo('Aborted');
    process.exit(0);
  }

  fs.writeFile('restore.log', '', err => {
    if (err) console.error(err);
  });

  // Step 4: Load any ID mappings saved by a previous run so we can resume
  // without re-uploading documents that were already created.
  // The map records { sourceId -> destinationId } for every successfully uploaded doc.
  const idMapFile = './restore/status/content-id-map.json';
  const idMap = new Map<string, string>(
    fs.existsSync(idMapFile)
      ? Object.entries(
          JSON.parse(fs.readFileSync(idMapFile, 'utf-8')) as Record<
            string,
            string
          >
        )
      : []
  );
  if (idMap.size > 0) {
    logInfo(`Loaded ${idMap.size} existing ID mappings from ${idMapFile}`);
  }

  // Step 5: Upload each document, persisting the ID map after every success
  // so progress is not lost if the script is interrupted.
  for (const doc of filteredDocs) {
    await timer(1100); // stay within the 1 req/sec rate limit
    const newId = await uploadDoc(doc, token, repository, idMap);
    if (newId) {
      idMap.set(doc.id, newId);
      fs.writeFileSync(
        idMapFile,
        JSON.stringify(Object.fromEntries(idMap), null, 2)
      );
    }
  }

  logSuccess(`ID map written to ${idMapFile} (${idMap.size} entries)`);
  logSuccess('Done');
  logInfo(
    `When you have finished updating hardcoded-ids.ts (Step 6), delete the restore/status/ directory.`
  );
}

init().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Error restoring content: ${message}`);
  process.exit(1);
});
