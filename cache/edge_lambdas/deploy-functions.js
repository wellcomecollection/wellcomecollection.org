// Compiles the beta test CloudFront Functions and uploads the JavaScript to
// S3, keyed by the git hash of their sources. The deployment pipeline picks
// it up from there for each environment: see
// .buildkite/scripts/deploy_beta_test_functions.sh.
const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const childProcess = require('child_process');
const fs = require('fs');

const s3 = new S3Client({ region: 'us-east-1' });
const bucket = 'weco-lambdas';
const functions = ['beta-tests-request', 'beta-tests-response'];

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    if (error.name === 'NotFound') return false;
    throw error;
  }
}

async function main() {
  const version = childProcess
    .execSync(
      'git rev-parse --short=12 HEAD:cache/edge_lambdas/cloudfront_functions',
      {
        encoding: 'utf-8',
      }
    )
    .trim();

  childProcess.execSync('yarn build:functions', { stdio: 'inherit' });

  for (const name of functions) {
    const key = `cloudfront_functions/${version}/${name}.js`;
    if (await exists(key)) {
      console.log(`${key} is already uploaded`);
      continue;
    }
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fs.readFileSync(`functions-dist/${name}.js`),
        ACL: 'private',
        ContentType: 'application/javascript',
      })
    );
    console.log(`Uploaded ${key}`);
  }
}

main().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
