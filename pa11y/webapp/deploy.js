const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const cloudfront = new AWS.CloudFront();
const fs = require('fs');

try {
  const data = fs.readFileSync(require.resolve('.dist/report.json'), {
    encoding: 'utf8',
  });

  const params = {
    Body: data,
    Bucket: 'dash.wellcomecollection.org',
    Key: 'pa11y/report.json',
    ACL: 'public-read',
    ContentType: 'application/json',
  };

  s3.putObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      process.exit(1);
    } else {
      console.log('Finished uploading report.json');

      cloudfront.createInvalidation(
        {
          DistributionId: 'EIOS79GG23UUY',
          InvalidationBatch: {
            Paths: { Items: ['/pa11y/report.json'], Quantity: 1 },
            CallerReference: `Pa11yDeployInvalidationCallerReference${Date.now()}`,
          },
        },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log('Flushed CloudFront cache for report.json');
        }
      );
    }
  });
} catch (e) {
  console.log('Error:', e.stack);
  process.exit(1);
}
