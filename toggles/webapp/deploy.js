const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const fs = require('fs');

try {
  const data = fs.readFileSync('toggles.json', 'utf8');

  const params = {
    Body: data,
    Bucket: 'toggles.wellcomecollection.org',
    Key: 'toggles.json',
    ACL: 'public-read',
    ContentType: 'application/json',
  };

  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Finished uploading toggles.json');
  });
} catch (e) {
  console.log('Error:', e.stack);
}
