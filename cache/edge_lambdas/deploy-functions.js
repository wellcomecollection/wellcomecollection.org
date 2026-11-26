// Compiles the beta test CloudFront Functions and uploads the JavaScript to
// S3, keyed by the git hash of their sources. The deployment pipeline picks
// it up from there for each environment: see
// .buildkite/scripts/deploy_beta_test_functions.sh.
const {
  GetObjectCommand,
  HeadObjectCommand,
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

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (error) {
    if (error.name === 'NotFound') return false;
    throw error;
  }
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
  const keys = FUNCTIONS.map(name => `${SOURCES}/${version}/${name}.js`);

  const missing = [];
  for (const key of keys) {
    if (!(await exists(key))) missing.push(key);
  }
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
