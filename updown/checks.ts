import { UpdownIO, CheckOptions } from 'updown.io';
import AWS from 'aws-sdk';
import yargs from 'yargs/yargs';
import chalk from 'chalk';
import expectedChecks from './expected-checks';
import { checksAreEqual, removeDuplicates } from './utils';

const { proceed } = yargs(process.argv)
  .option('proceed', {
    type: 'boolean',
    description: 'Run with verbose logging',
    default: false,
  })
  .parse();

// set region if not set (as not set by the SDK by default)
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}

const error = (message: string) => {
  console.error(chalk.redBright(message));
  process.exit(1);
};

const secretsManager = new AWS.SecretsManager();
const getSecretParams = { SecretId: 'builds/updown_api_key' };
let updownIO: UpdownIO;

export type Check = {
  url: string;
  token?: string;
} & CheckOptions;

secretsManager
  .getSecretValue(getSecretParams)
  .promise()
  .then(secretData => {
    updownIO = new UpdownIO(secretData['SecretString']);
    return updownIO.api.checks.getChecks();
  })
  .then(checkData => {
    const currentChecks = checkData.map(check => ({
      token: check.token,
      url: check.url,
      alias: check.alias,
      period: check.period,
    }));

    // deletions: any URLs in the current checks, not in the expected checks
    const deletions = removeDuplicates(currentChecks, expectedChecks);

    // additions: any URLs in the expected checks, not in the current checks
    const additions = removeDuplicates(expectedChecks, currentChecks);

    // updates: any URLs in the current checks and expected checks with different data
    // return the tokened updated checks
    const updates = expectedChecks
      .map(expectedCheck => {
        const matchingCheck = currentChecks.find(
          currentCheck => currentCheck.url === expectedCheck.url
        );

        const tokenedMatchingCheck = matchingCheck
          ? {
              ...expectedCheck,
              token: matchingCheck.token,
            }
          : undefined;

        return matchingCheck &&
          tokenedMatchingCheck &&
          !checksAreEqual(tokenedMatchingCheck, matchingCheck)
          ? tokenedMatchingCheck
          : undefined;
      })
      .filter(Boolean) as Check[];

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
      updownIO.api.checks.deleteCheck(check.token!);
    });

    const updatesRequests = updates.map(check => {
      updownIO.api.checks.updateCheck(check.token!, {
        alias: check.alias,
        period: check.period,
      });
    });

    const additionsRequests = additions.map(check => {
      updownIO.api.checks.addCheck(check.url, {
        alias: check.alias,
        period: check.period,
      });
    });

    return Promise.all(
      deletionRequests.concat(updatesRequests, additionsRequests)
    );
  })
  .catch(error => {
    console.error(error);
  });
