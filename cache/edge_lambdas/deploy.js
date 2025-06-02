const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const archiver = require('archiver');
const childProcess = require('child_process');
const fs = require('fs');

const s3 = new S3Client({ region: 'us-east-1' });

function runCommand(command, options = {}) {
  console.log(`Running: ${command}`);
  try {
    return childProcess.execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit',
      ...options,
    });
  } catch (error) {
    console.error(`Failed to run command: ${command}`);
    process.exit(1);
  }
}

function buildProject() {
  console.log('Building TypeScript project...');
  runCommand('yarn build');
}

async function packageLambda() {
  console.log('Packaging lambda function...');

  // Clean up any existing zip file
  if (fs.existsSync('edge_lambda_origin.zip')) {
    fs.unlinkSync('edge_lambda_origin.zip');
  }

  // Check if dist directory exists and has content
  if (!fs.existsSync('dist')) {
    console.error(
      'dist directory not found. Make sure the build completed successfully.'
    );
    process.exit(1);
  }

  const distFiles = fs.readdirSync('dist');
  if (distFiles.length === 0) {
    console.error(
      'dist directory is empty. Make sure the build completed successfully.'
    );
    process.exit(1);
  }

  // Create zip file
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream('edge_lambda_origin.zip');
    const archive = archiver('zip');

    output.on('close', () => {
      console.log('Package created: edge_lambda_origin.zip');
      resolve();
    });

    archive.on('error', err => {
      console.error('Error creating zip file:', err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
  });
}

function uploadNewLambdaPackage(bucket, key, lastGitCommit) {
  const data = fs.readFileSync('edge_lambda_origin.zip');

  const putParams = {
    Body: data,
    Bucket: bucket,
    Key: key,
    ACL: 'private',
    ContentType: 'application/zip',
    Metadata: {
      gitCommit: lastGitCommit,
    },
  };

  s3.send(new PutObjectCommand(putParams))
    .then(() => console.log('Finished uploading edge_lambda_origin.zip'))
    .catch(err => console.log(err, err.stack));
}

async function main() {
  console.log('Starting edge lambda deployment...');

  // Build the project
  buildProject();

  // Package the lambda
  await packageLambda();

  // Get the last Git commit that modified the edge_lambdas folder.
  //
  // The Lambda should be totally determined by the contents of
  // this folder, so if it hasn't changed we can skip the deployment.
  //
  // This will reduce churn in the associated Terraform stack.
  const lastGitCommit = childProcess
    .execSync('git log -n 1 --pretty=format:%H -- .', { encoding: 'utf-8' })
    .trim();

  console.log(`Last Git commit to modify this package was ${lastGitCommit}`);

  const bucket = 'weco-lambdas';
  const key = 'edge_lambda_origin.zip';

  const getParams = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const data = await s3.send(new HeadObjectCommand(getParams));
    if (data.Metadata?.gitcommit === lastGitCommit) {
      console.log(
        'S3 deployment package is already up-to-date; skipping deployment'
      );
    } else {
      console.log('S3 deployment package is stale; uploading new Lambda');
      uploadNewLambdaPackage(bucket, key, lastGitCommit);
    }
  } catch (error) {
    if (error.name === 'NotFound') {
      console.log('No existing package found in S3; uploading new Lambda');
      uploadNewLambdaPackage(bucket, key, lastGitCommit);
    } else {
      console.error('Error checking S3:', error);
      process.exit(1);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
