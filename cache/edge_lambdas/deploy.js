const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const fs = require('fs');

try {
  const data = fs.readFileSync('edge_lambda_origin.zip');

  const params = {
    Body: data,
    Bucket: 'weco-lambdas',
    Key: 'edge_lambda_origin.zip',
    ACL: 'private',
    ContentType: 'application/zip',
  };

  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Finished uploading edge_lambda_origin.zip');
  });
} catch (e) {
  console.log('Error:', e.stack);
}
