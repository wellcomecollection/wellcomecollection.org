import { execFileSync } from 'child_process';

import { logInfo, logSuccess } from './logger';

/**
 * Build a Docker image for an app using its Dockerfile.
 *
 * Builds for linux/amd64 platform (required for ECS deployment).
 * Uses the repo root as build context so the Dockerfile can access all necessary files.
 *
 * @param app - Application name (used to locate Dockerfile and in logs)
 * @param imageUri - Full ECR URI to tag the image with (registry/repo:tag)
 * @param repoRoot - Absolute path to the repository root (build context)
 */
export function buildImage(
  app: string,
  imageUri: string,
  repoRoot: string
): void {
  const dockerfile = `${app}/Dockerfile`;

  logInfo(`Building ${app} image...`);
  logInfo(`  Dockerfile: ${dockerfile}`);
  logInfo(`  Tag: ${imageUri}`);
  logInfo('  Platform: linux/amd64');

  execFileSync(
    'docker',
    [
      'build',
      '-f',
      dockerfile,
      '.',
      '--platform',
      'linux/amd64',
      '-t',
      imageUri,
    ],
    { cwd: repoRoot, stdio: 'inherit' }
  );

  logSuccess(`Built ${app} image`);
}

/**
 * Push a Docker image to ECR.
 *
 * Requires Docker to already be authenticated with ECR (via ecr-login.ts).
 *
 * @param app - Application name (for logging)
 * @param imageUri - Full ECR URI of the image to push
 */
export function pushImage(app: string, imageUri: string): void {
  logInfo(`Pushing ${app} image to ECR...`);

  execFileSync('docker', ['push', imageUri], { stdio: 'inherit' });

  logSuccess(`Pushed ${app} image`);
}
