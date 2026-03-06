import {
  BatchGetImageCommand,
  DescribeImagesCommand,
  ECRClient,
  ImageAlreadyExistsException,
  ImageNotFoundException,
  PutImageCommand,
  RepositoryNotFoundException,
} from '@aws-sdk/client-ecr';

import { BACKUP_TAG, DEV_TAG, ENV_TAG } from './config';
import { logInfo, logSuccess } from './logger';

/**
 * Helper to treat ECR "not found" errors as null/empty but rethrow
 * auth/network/permission errors so they're actionable.
 *
 * This prevents silent failures where credential or network issues are
 * mistaken for "image not found" scenarios.
 *
 * @param error - The caught error
 * @param notFoundValue - Value to return for "not found" cases
 * @returns The notFoundValue if error is ImageNotFound/RepositoryNotFound
 * @throws The original error if it's not a "not found" case
 */
function handleECRError<T>(error: unknown, notFoundValue: T): T {
  if (
    error instanceof ImageNotFoundException ||
    error instanceof RepositoryNotFoundException
  ) {
    return notFoundValue;
  }
  throw error;
}

/**
 * Get the manifest for a specific image tag from ECR.
 *
 * The manifest is needed to retag images (you can't retag by tag alone).
 * Returns null if the image doesn't exist. Auth/network errors propagate.
 *
 * @param client - Authenticated ECR client
 * @param repo - ECR repository name
 * @param tag - Image tag to look up
 * @returns Image manifest JSON string, or null if image not found
 */
export async function getImageManifest(
  client: ECRClient,
  repo: string,
  tag: string
): Promise<string | null> {
  try {
    const result = await client.send(
      new BatchGetImageCommand({
        repositoryName: repo,
        imageIds: [{ imageTag: tag }],
      })
    );
    const manifest = result.images?.[0]?.imageManifest;
    return manifest ?? null;
  } catch (error) {
    return handleECRError(error, null);
  }
}

/**
 * Apply a tag to an existing image in ECR.
 *
 * Tags are created by digest (via manifest), not by copying from another tag.
 * This allows multiple tags to point to the same image.
 *
 * @param client - Authenticated ECR client
 * @param repo - ECR repository name
 * @param tag - New tag to create
 * @param manifest - Image manifest (from getImageManifest)
 * @throws ImageAlreadyExistsException if tag already exists on this image
 */
export async function putImageTag(
  client: ECRClient,
  repo: string,
  tag: string,
  manifest: string
): Promise<void> {
  await client.send(
    new PutImageCommand({
      repositoryName: repo,
      imageTag: tag,
      imageManifest: manifest,
    })
  );
}

async function getImageTags(
  client: ECRClient,
  repo: string,
  digest: string
): Promise<string[]> {
  try {
    const result = await client.send(
      new DescribeImagesCommand({
        repositoryName: repo,
        imageIds: [{ imageDigest: digest }],
      })
    );
    return result.imageDetails?.[0]?.imageTags ?? [];
  } catch (error) {
    return handleECRError(error, []);
  }
}

async function getImageDigest(
  client: ECRClient,
  repo: string,
  tag: string
): Promise<string | null> {
  try {
    const result = await client.send(
      new DescribeImagesCommand({
        repositoryName: repo,
        imageIds: [{ imageTag: tag }],
      })
    );
    return result.imageDetails?.[0]?.imageDigest ?? null;
  } catch (error) {
    return handleECRError(error, null);
  }
}

/**
 * Find the Git ref tag associated with an image.
 *
 * Images built by CI have tags like "ref.abc123def" that identify the commit.
 * This helps users know which commit they're deploying or restoring.
 *
 * @param client - Authenticated ECR client
 * @param repo - ECR repository name
 * @param tag - Image tag to look up
 * @returns Git ref tag (e.g., "ref.abc123"), or null if not found
 */
export async function getRefTagForImage(
  client: ECRClient,
  repo: string,
  tag: string
): Promise<string | null> {
  const digest = await getImageDigest(client, repo, tag);
  if (!digest) return null;

  const tags = await getImageTags(client, repo, digest);
  return tags.find(t => t.startsWith('ref.')) ?? null;
}

/**
 * Save the current staging image as a backup before deploying a dev build.
 *
 * Copies the ENV_TAG image to BACKUP_TAG so it can be restored later.
 * If no ENV_TAG exists (first deployment), skips backup gracefully.
 * If the backup tag already exists on this image, reports success without error.
 *
 * @param client - Authenticated ECR client
 * @param repo - ECR repository name
 */
export async function backupCurrentTag(
  client: ECRClient,
  repo: string
): Promise<void> {
  logInfo(`Backing up current ${ENV_TAG} tag...`);

  const manifest = await getImageManifest(client, repo, ENV_TAG);
  if (!manifest) {
    logInfo(`No existing ${ENV_TAG} tag found, skipping backup`);
    return;
  }

  const refTag = await getRefTagForImage(client, repo, ENV_TAG);
  if (refTag) {
    logInfo(`Current ${ENV_TAG} points to: ${refTag}`);
  }

  try {
    await putImageTag(client, repo, BACKUP_TAG, manifest);
    logSuccess(`Saved current image as ${BACKUP_TAG}`);
  } catch (error) {
    // Only ignore if the tag already exists; rethrow auth/network/permission errors
    if (error instanceof ImageAlreadyExistsException) {
      logSuccess(`Image already tagged as ${BACKUP_TAG}`);
    } else {
      throw error;
    }
  }

  if (refTag) {
    console.log(
      '         To restore later, run: yarn deploy-dev restore <app>'
    );
  }
}

/**
 * Retag a dev build as the active staging image.
 *
 * Copies the DEV_TAG to ENV_TAG so ECS will deploy the new image.
 * If they already point to the same image, skips the retag operation.
 *
 * @param client - Authenticated ECR client
 * @param repo - ECR repository name
 * @throws Error if DEV_TAG image doesn't exist
 */
export async function retagImage(
  client: ECRClient,
  repo: string
): Promise<void> {
  logInfo(`Retagging ${DEV_TAG} -> ${ENV_TAG} for ${repo}...`);

  const devManifest = await getImageManifest(client, repo, DEV_TAG);
  if (!devManifest) {
    throw new Error(`Could not find image with tag ${DEV_TAG} in ${repo}`);
  }

  const envManifest = await getImageManifest(client, repo, ENV_TAG);

  if (devManifest !== envManifest) {
    await putImageTag(client, repo, ENV_TAG, devManifest);
    logSuccess(`Retagged image as ${ENV_TAG}`);
  } else {
    logSuccess(`Image already tagged as ${ENV_TAG}, skipping retag`);
  }
}
