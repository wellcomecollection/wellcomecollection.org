/* global fetch, AbortSignal */

const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require('@aws-sdk/client-cloudfront');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { styleText } = require('util');

const { issuesOfType } = require('./issues');

const s3Client = new S3Client({ region: 'eu-west-1' });
const cloudFrontClient = new CloudFrontClient({ region: 'eu-west-1' });

const BUCKET = 'dash.wellcomecollection.org';
const KEY = 'pa11y/report.json';
const DISTRIBUTION_ID = 'EIOS79GG23UUY';

/**
 * Uploads the report the dashboard reads, and flushes it from CloudFront.
 *
 * Throws if either step fails: the dashboard would otherwise go on showing the
 * previous day's report as if it were today's.
 */
const publishReport = async results => {
  await s3Client.send(
    new PutObjectCommand({
      Body: JSON.stringify({ results, timestamp: new Date().toISOString() }),
      Bucket: BUCKET,
      Key: KEY,
      ACL: 'public-read',
      ContentType: 'application/json',
    })
  );
  console.log(styleText('greenBright', 'Finished uploading report.json'));

  await cloudFrontClient.send(
    new CreateInvalidationCommand({
      DistributionId: DISTRIBUTION_ID,
      InvalidationBatch: {
        Paths: { Items: [`/${KEY}`], Quantity: 1 },
        CallerReference: `Pa11yDeployInvalidationCallerReference${Date.now()}`,
      },
    })
  );
  console.log(
    styleText('greenBright', 'Flushed CloudFront cache for report.json')
  );
};

const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// Tell the team about errors. Only the daily scheduled run passes a webhook URL,
// so that's the only run that alerts. Warnings are for checking by hand, so they never alert.
const alertOnErrors = async (results, slackWebhookUrl) => {
  const countsByPage = results
    .map(result => issuesOfType(result, 'error').length)
    .filter(count => count > 0);

  const errorCount = countsByPage.reduce((total, count) => total + count, 0);

  if (errorCount === 0) {
    return;
  }

  // Expected on deploy and manual runs, which aren't given a webhook URL. Worth
  // logging because on the scheduled run it means the alert is broken, and
  // returning quietly there reads exactly like a clean run
  if (!slackWebhookUrl) {
    console.log(
      styleText(
        'yellowBright',
        `${errorCount} error(s) found, not alerting: no webhook URL (expected except on the scheduled run)`
      )
    );
    return;
  }

  try {
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        errorInfo: pluralize(errorCount, 'error'),
        pageInfo: pluralize(countsByPage.length, 'page'),
      }),
      // Without this a silent webhook holds the step open for undici's
      // five-minute default, for an alert that's no use late anyway
      signal: AbortSignal.timeout(10000),
    });

    // Slack answers a bad request with a 4xx rather than an error, so without
    // this the alert would go missing quietly. Note it still returns 200 for a
    // variable the workflow doesn't declare, posting the message with that
    // field blank, so this won't catch a rename there.
    if (!response.ok) {
      throw new Error(
        `${response.status} ${response.statusText}: ${await response.text()}`
      );
    }

    console.log(styleText('greenBright', 'Sent the Slack alert'));
  } catch (e) {
    // The report is already uploaded, so a failed alert shouldn't fail the run
    console.error(styleText('redBright', 'Error sending the Slack alert'));
    console.log(e);
  }
};

module.exports = { publishReport, alertOnErrors };
