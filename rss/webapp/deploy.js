const zipLocation = 'dist/stories_rss.zip';
const s3Bucket = 'wellcomecollection-experience-infra';
const s3Key = 'lambdas/stories_rss.zip';
const roleArn = 'arn:aws:iam::130871440101:role/experience-ci';

const AWS = require('aws-sdk');
const fs = require('fs');

const roleCredentials = new AWS.ChainableTemporaryCredentials({
  params: { RoleArn: roleArn },
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials: roleCredentials,
});

try {
  const data = fs.readFileSync(zipLocation);

  const params = {
    Body: data,
    Bucket: s3Bucket,
    Key: s3Key,
    ACL: 'private',
    ContentType: 'application/zip',
  };

  s3.putObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else
      console.log(
        'Finished uploading ' +
          zipLocation +
          ' to s3://' +
          s3Bucket +
          '/' +
          s3Key
      );
  });
} catch (e) {
  console.log('Error:', e.stack);
}
