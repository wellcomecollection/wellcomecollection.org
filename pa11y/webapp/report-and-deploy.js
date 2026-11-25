const { styleText } = require('util');
const yargs = require('yargs');

const { auditPages } = require('./report/audit-pages');
const {
  countOfType,
  issuesLog,
  warningsSummary,
  pagesThatFailedToLoad,
} = require('./report/issues');
const { publishReport, alertOnErrors } = require('./report/publish');
const { paths } = require('./report/urls');

const { isPullRequestRun, allWarnings, slackWebhookUrl } = yargs(
  process.argv.slice(2)
)
  .usage('Usage: $0 --isPullRequestRun [boolean] --allWarnings [boolean]')
  .env('PA11Y')
  .options({
    isPullRequestRun: { type: 'boolean' },
    allWarnings: {
      type: 'boolean',
      description: 'List every warning, not just the summary',
    },
    slackWebhookUrl: { type: 'string' },
  })
  .parseSync();

const baseUrl = isPullRequestRun
  ? 'https://www-e2e.wellcomecollection.org'
  : 'https://wellcomecollection.org';

const urls = paths.map(path => `${baseUrl}${path}`);

// Exits 1 if any page didn't load, because its clean result would otherwise
// read as a page with nothing wrong with it
const failOnPagesThatDidntLoad = results => {
  const failedPages = pagesThatFailedToLoad(results, urls);

  if (failedPages.length === 0) {
    return;
  }

  console.error(
    styleText(
      'redBright',
      `${failedPages.length} page(s) failed to load properly`
    )
  );
  failedPages.forEach(({ url, result }) => {
    console.error(`  - ${url} (title: "${result.documentTitle || 'missing'}")`);
  });
  process.exit(1);
};

// What a pull request run prints, and whether it passes
const reportToPullRequest = results => {
  const errorsLog = issuesLog(results, 'error');
  const warningsCount = countOfType(results, 'warning');

  if (errorsLog.length > 0) {
    console.error(`!!! ${styleText('redBright', 'Fix these before merging')}`);
    console.log(...errorsLog);
  }

  // Warnings don't fail the run, and mostly repeat the same few
  // patterns, so summarise them unless asked for the full list
  if (warningsCount > 0) {
    console.log(
      styleText(
        'yellowBright',
        `${warningsCount} warning(s) for checking by hand:`
      )
    );
    console.log(warningsSummary(results));

    if (allWarnings) {
      console.log(...issuesLog(results, 'warning'));
    } else {
      console.log('Run with --allWarnings to list each one');
    }
  }

  if (errorsLog.length === 0) {
    console.log(styleText('greenBright', 'Report done, no errors found'));
  }

  process.exit(errorsLog.length > 0 ? 1 : 0);
};

// What every other run does: publish the report for the dashboard, then alert
const reportToDashboard = async results => {
  console.info(styleText('greenBright', 'Reporting done!'));

  try {
    await publishReport(results);
  } catch (err) {
    console.error(styleText('redBright', 'Error uploading report.json'));
    console.log(err);
    process.exit(1);
  }

  await alertOnErrors(results, slackWebhookUrl);
};

const main = async () => {
  console.info('Pa11y: Starting report');

  const results = await auditPages(urls);

  failOnPagesThatDidntLoad(results);

  if (isPullRequestRun) {
    reportToPullRequest(results);
  } else {
    await reportToDashboard(results);
  }
};

main().catch(error => {
  console.log({ error });
  process.exit(1);
});
