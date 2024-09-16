const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
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

  s3.putObject(putParams, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Finished uploading edge_lambda_origin.zip');
  });
}

try {
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

  s3.headObject(getParams, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      if (data.Metadata !== null && data.Metadata.gitcommit === lastGitCommit) {
        console.log(
          'S3 deployment package is already up-to-date; skipping deployment'
        );
      } else {
        console.log('S3 deployment package is stale; uploading new Lambda');
        uploadNewLambdaPackage(bucket, key, lastGitCommit);
      }
    }
  });
} catch (e) {
  console.log('Error:', e.stack);
}
