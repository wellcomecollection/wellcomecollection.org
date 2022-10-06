const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const fs = require('fs');

try {
  const data = fs.readFileSync('.dist/report.json', 'utf8');

  const params = {
    Body: data,
    Bucket: 'dash.wellcomecollection.org',
    Key: 'pa11y/report.json',
    ACL: 'public-read',
    ContentType: 'application/json',
  };

  s3.putObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Finished uploading report.json');
  });
} catch (e) {
  console.log('Error:', e.stack);
}
