const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: 'us-east-1' });

const childProcess = require('child_process');
const fs = require('fs');

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
    .then(data => console.log('Finished uploading edge_lambda_origin.zip'))
    .catch(err => console.log(err, err.stack));
}

// Get the last Git commit that modified the edge_lambdas folder.
//
// The Lambda should be totally determined by the contents of
// this folder, so if it hasn't changed we can skip the deployment.
//
// This will reduce churn in the associated Terraform stack.
const lastGitCommit = childProcess.execSync(
  'git log -n 1 --pretty=format:%H -- .',
  { encoding: 'utf-8' }
);

console.log(`Last Git commit to modify this package was ${lastGitCommit}`);

const bucket = 'weco-lambdas';
const key = 'edge_lambda_origin.zip';

const getParams = {
  Bucket: bucket,
  Key: key,
};

s3.send(new HeadObjectCommand(getParams)).then(data => {
  if (data.Metadata?.gitcommit === lastGitCommit) {
    console.log(
      'S3 deployment package is already up-to-date; skipping deployment'
    );
  } else {
    console.log('S3 deployment package is stale; uploading new Lambda');
    uploadNewLambdaPackage(bucket, key, lastGitCommit);
  }
});
