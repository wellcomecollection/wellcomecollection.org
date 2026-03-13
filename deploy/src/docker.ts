import { execFileSync } from 'child_process';

import { logInfo, logSuccess } from './logger';

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

export function pushImage(app: string, imageUri: string): void {
  logInfo(`Pushing ${app} image to ECR...`);

  execFileSync('docker', ['push', imageUri], { stdio: 'inherit' });

  logSuccess(`Pushed ${app} image`);
}
