// Compiles the beta test CloudFront Functions and uploads the JavaScript to
// S3, keyed by the git hash of their sources. The deployment pipeline picks
// it up from there for each environment: see
// .buildkite/scripts/deploy_beta_test_functions.sh.
const {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3');
const childProcess = require('child_process');
const fs = require('fs');

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'weco-lambdas';
const SOURCES = 'cloudfront_functions';
const FUNCTIONS = ['beta-tests-request', 'beta-tests-response'];

function git(command) {
  return childProcess.execSync(`git ${command}`, { encoding: 'utf-8' }).trim();
}

// A list rather than HeadObject, because CI may only list under this prefix,
// and without that HeadObject answers a missing key with 403
async function uploadedKeys(prefix) {
  const { Contents = [] } = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix })
  );
  return Contents.map(object => object.Key);
}

async function uploaded(key) {
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );
  return Body.transformToString();
}

async function main() {
  // The key is the committed hash, so the code under it must be committed too
  if (git(`status --porcelain -- ${SOURCES}`)) {
    throw new Error(`${SOURCES} has uncommitted changes`);
  }
  const version = git(
    `rev-parse --short=12 HEAD:cache/edge_lambdas/${SOURCES}`
  );
  const prefix = `${SOURCES}/${version}/`;
  const keys = FUNCTIONS.map(name => `${prefix}${name}.js`);

  const existing = await uploadedKeys(prefix);
  const missing = keys.filter(key => !existing.includes(key));
  if (missing.length === 0) {
    console.log(`Functions at ${version} are already uploaded`);
    return;
  }

  childProcess.execSync('yarn build:functions', { stdio: 'inherit' });

  for (const [i, key] of keys.entries()) {
    const code = fs.readFileSync(`functions-dist/${FUNCTIONS[i]}.js`, 'utf-8');
    if (!missing.includes(key)) {
      // Same sources, so it should be the same code; anything else is a mistake
      if ((await uploaded(key)) !== code) {
        throw new Error(`${key} differs from the code compiled here`);
      }
      continue;
    }
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: code,
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
