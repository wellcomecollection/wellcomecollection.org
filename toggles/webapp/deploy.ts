#!/usr/bin/env ts-node-script

import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

try {
  const data = fs.readFileSync('toggles.json', 'utf8');

  const params = {
    Body: data,
    Bucket: 'toggles.wellcomecollection.org',
    Key: 'toggles.json',
    ACL: 'public-read',
    ContentType: 'application/json',
  };

  s3.putObject(params, function(err) {
    if (err) console.log(err, err.stack);
    else console.log('Finished uploading toggles.json');
  });
} catch (e) {
  console.error('Error:', e.stack);
}
