import {
  BatchGetImageCommand,
  DescribeImagesCommand,
  ECRClient,
  PutImageCommand,
} from '@aws-sdk/client-ecr';

import { BACKUP_TAG, DEV_TAG, ENV_TAG } from './config';
import { logInfo, logSuccess } from './logger';

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
  } catch {
    return null;
  }
}

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
  } catch {
    return [];
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
  } catch {
    return null;
  }
}

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
  } catch {
    // Ignore errors — image may already have this tag
  }

  logSuccess(`Saved current image as ${BACKUP_TAG}`);
  if (refTag) {
    console.log(
      '         To restore later, run: yarn deploy-dev restore <app>'
    );
  }
}

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
