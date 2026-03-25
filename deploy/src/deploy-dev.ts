import { ECRClient } from '@aws-sdk/client-ecr';
import { ECSClient } from '@aws-sdk/client-ecs';
import { fromIni } from '@aws-sdk/credential-providers';
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  type AppName,
  BACKUP_TAG,
  CLUSTER,
  DEV_TAG,
  ECR_REGION,
  ECR_REGISTRY,
  ENV_TAG,
  getAppConfig,
} from './config';
import { buildImage, pushImage } from './docker';
import {
  backupCurrentTag,
  getImageManifest,
  getRefTagForImage,
  putImageTag,
  retagImage,
} from './ecr';
import { loginToPrivateEcr, loginToPublicEcr } from './ecr-login';
import { forceNewDeployment, waitForServiceStable } from './ecs';
import { logBanner, logError, logInfo, logSuccess } from './logger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

function getCredentials() {
  const platformCreds = fromIni({ profile: 'platform-developer' });
  const experienceCreds = fromIni({ profile: 'experience-developer' });
  return { platformCreds, experienceCreds };
}

async function deploy(app: AppName) {
  const { repo, service } = getAppConfig(app);
  const imageUri = `${ECR_REGISTRY}/${repo}:${DEV_TAG}`;

  logBanner(`Deploying ${app} to staging`);

  const { platformCreds, experienceCreds } = getCredentials();
  const ecrClient = new ECRClient({
    region: ECR_REGION,
    credentials: experienceCreds,
  });
  const ecsClient = new ECSClient({
    region: ECR_REGION,
    credentials: experienceCreds,
  });

  logInfo('Logging in to ECR registries...');
  await loginToPublicEcr(platformCreds);
  await loginToPrivateEcr(experienceCreds);

  console.log('');
  buildImage(app, imageUri, REPO_ROOT);

  console.log('');
  pushImage(app, imageUri);

  console.log('');
  await backupCurrentTag(ecrClient, repo);

  console.log('');
  await retagImage(ecrClient, repo);

  console.log('');
  await forceNewDeployment(ecsClient, CLUSTER, service);
  await waitForServiceStable(ecsClient, CLUSTER, service);

  logBanner(`Successfully deployed ${app} to staging`, 'green');
}

async function restore(app: AppName) {
  const { repo, service } = getAppConfig(app);

  logBanner(`Restoring ${app} to pre-dev state`);

  const { experienceCreds } = getCredentials();
  const ecrClient = new ECRClient({
    region: ECR_REGION,
    credentials: experienceCreds,
  });
  const ecsClient = new ECSClient({
    region: ECR_REGION,
    credentials: experienceCreds,
  });

  logInfo(`Looking for backup tag ${BACKUP_TAG}...`);

  const backupManifest = await getImageManifest(ecrClient, repo, BACKUP_TAG);
  if (!backupManifest) {
    logError(`No backup tag (${BACKUP_TAG}) found for ${repo}`);
    logError('Cannot restore — no previous deployment was saved');
    process.exit(1);
  }

  const refTag = await getRefTagForImage(ecrClient, repo, BACKUP_TAG);
  if (refTag) {
    logInfo(`Backup image is: ${refTag}`);
  }

  logInfo(`Restoring ${ENV_TAG} from ${BACKUP_TAG}...`);
  await putImageTag(ecrClient, repo, ENV_TAG, backupManifest);
  logSuccess(`Restored ${ENV_TAG} tag`);

  console.log('');
  await forceNewDeployment(ecsClient, CLUSTER, service);
  await waitForServiceStable(ecsClient, CLUSTER, service);

  logBanner(`Successfully restored ${app}`, 'green');
}

const appChoices = ['content', 'identity'] as const;

yargs(hideBin(process.argv))
  .scriptName('deploy-dev')
  .usage('$0 <command>')
  .command(
    'restore <app>',
    'Restore an app to its pre-dev state',
    yargs =>
      yargs.positional('app', {
        describe: 'App to restore',
        choices: appChoices,
        demandOption: true,
      }),
    async argv => {
      await restore(argv.app as AppName);
    }
  )
  .command(
    '$0 <app>',
    'Build and deploy an app to staging',
    yargs =>
      yargs.positional('app', {
        describe: 'App to deploy',
        choices: appChoices,
        demandOption: true,
      }),
    async argv => {
      await deploy(argv.app as AppName);
    }
  )
  .strict()
  .help()
  .parseAsync()
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logError(message);
    process.exit(1);
  });
