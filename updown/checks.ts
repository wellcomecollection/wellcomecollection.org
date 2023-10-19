import AWS from 'aws-sdk';
import yargs from 'yargs/yargs';
import chalk from 'chalk';
import { UpdownClient } from 'node-updown';
import { CheckOptions } from 'node-updown/lib/types/Check';
import expectedChecks from './expected-checks';
import { getDeltas } from './utils';

const { proceed } = yargs(process.argv)
  .option('proceed', {
    type: 'boolean',
    description: 'Run with verbose logging',
    default: false,
  })
  .parseSync();

// set region if not set (as not set by the SDK by default)
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}

// this may or may not be needed depending on the way your aws profiles are set up
// const credentials = new AWS.SharedIniFileCredentials({
//   profile: 'platform-developer',
// });
// AWS.config.credentials = credentials;

const error = (message: string) => {
  console.error(chalk.redBright(message));
  process.exit(1);
};

const secretsManager = new AWS.SecretsManager();
const getSecretParams = { SecretId: 'builds/updown_api_key' };

export type Check = {
  token: string;
} & CheckOptions;

let client: UpdownClient;
/* eslint-disable @typescript-eslint/no-explicit-any */
secretsManager
  .getSecretValue(getSecretParams)
  .promise()
  .then(secretData => {
    client = new UpdownClient(secretData.SecretString as string);
    return client.getChecks();
  })
  .then(async checkData => {
    const currentChecks = checkData.map(check => ({
      token: check.token,
      url: check.url,
      alias: check.alias,
      period: check.period,
    }));

    const { deletions, updates, additions } = getDeltas(
      currentChecks,
      expectedChecks
    );

    // Bit ugly, but best way to get the right output
    console.info(
      chalk.red(
        `deleting ${deletions.length}\n${deletions
          .map(c => ` - ${c.token}:${c.url}`)
          .join('\n')}`
      )
    );

    console.info(
      chalk.yellow(
        `updating ${updates.length}\n${updates
          .map(c => ` ~ ${c.token}:${c.url}`)
          .join('\n')}`
      )
    );

    console.info(
      chalk.green(
        `adding ${additions.length}\n${additions
          .map(c => ` + ${c.url}`)
          .join('\n')}`
      )
    );

    // We error on deletions for now as if you update a URL, this will be flagged as a deletion.
    // If this is done in error, that data is lost forever.
    // We don't add / update either as those changes might be related to the deletions.
    if (!proceed && deletions.length !== 0) {
      error(
        `There are ${deletions.length} deletions that need to be made. Please check them, and run the script with --proceed.`
      );
    }

    const deletionRequests = deletions.map(check => {
      return client.deleteCheck(check.token);
    });

    const updatesRequests = updates.map(check => {
      return client.updateCheck(check.token, {
        alias: check.alias,
        period: 60,
      });
    });

    const additionsRequests = additions.map(check => {
      return client.addCheck({
        url: check.url,
        alias: check.alias,
        period: check.period,
      });
    });

    // We do these separately to satisfy typescript
    await Promise.all(deletionRequests);
    await Promise.all(updatesRequests);
    await Promise.all(additionsRequests);
  })
  .catch((error: any) => {
    console.error(error);
  });
/* eslint-enable @typescript-eslint/no-explicit-any */
