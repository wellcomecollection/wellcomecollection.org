import { UpdownIO } from 'updown.io';
import AWS from 'aws-sdk';
import expectedChecks from './expected-checks.js';
import { removeDuplicates } from './utils.js';

// set region if not set (as not set by the SDK by default)
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}

const secretsManager = new AWS.SecretsManager();
const getSecretParams = { SecretId: 'builds/updown_api_key' };
let updownIO;
secretsManager
  .getSecretValue(getSecretParams)
  .promise()
  .then(secretData => {
    updownIO = new UpdownIO(secretData['SecretString']);
    return updownIO.api.checks.getChecks();
  })
  .then(checkData => {
    const remoteChecks = checkData.map(check => ({
      url: check.url,
      alias: check.alias,
      period: check.period,
    }));
    const deletions = removeDuplicates(remoteChecks, expectedChecks);
    const additions = removeDuplicates(expectedChecks, remoteChecks);
    deletions.map(check => {
      updownIO.api.checks.deleteCheck(check.url);
    });
    additions.map(check => {
      updownIO.api.checks.addCheck(check.url, {
        alias: check.alias,
        period: check.period,
      });
    });
  });
